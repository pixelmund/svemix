import { encrypt, decrypt } from 'zencrypt';
import { makeCookie as serialize, parseCookies } from '$lib/cookie';
import type { BinaryLike, SessionOptions } from './types';
import {
	daysToMaxage,
	maxAgeToDateOfExpiry,
	normalizeConfig,
	type NormalizedConfig
} from './utils.js';

export async function cookieSession<SessionType = Record<string, any>>(
	headersOrCookieString: Headers | string,
	userConfig: SessionOptions
) {
	const config = normalizeConfig(userConfig);

	let shouldSync = false;
	let setCookieString: string | undefined;
	const cookieString =
		typeof headersOrCookieString === 'string'
			? headersOrCookieString
			: headersOrCookieString.get('cookie') || '';
	const cookies = parseCookies(cookieString, {});

	let { data: sessionData, state } = await getSessionData(
		cookies[config.key] || '',
		config.secrets
	);

	async function setSession(sd: SessionType) {
		shouldSync = true;

		let maxAge = config.cookie.maxAge;

		if (sessionData?.expires) {
			maxAge = new Date(sessionData.expires).getTime() / 1000 - new Date().getTime() / 1000;
		}

		sessionData = {
			...sd,
			expires: maxAgeToDateOfExpiry(maxAge)
		};

		setCookieString = await makeCookie(sessionData, config, maxAge);
	}

	async function refreshSession(expiresInDays?: number) {
		if (!sessionData) {
			return false;
		}

		shouldSync = true;

		const newMaxAge = daysToMaxage(expiresInDays ? expiresInDays : config.expiresInDays);

		sessionData = {
			...sessionData,
			expires: maxAgeToDateOfExpiry(newMaxAge)
		};

		setCookieString = await makeCookie(sessionData, config, newMaxAge);
	}

	async function destroySession() {
		shouldSync = true;
		sessionData = {};
		setCookieString = await makeCookie({}, config, 0, true);
	}

	async function reEncryptSession() {
		shouldSync = true;

		let maxAge = config.cookie.maxAge;

		if (sessionData?.expires) {
			maxAge = new Date(sessionData.expires).getTime() / 1000 - new Date().getTime() / 1000;
		}

		setCookieString = await makeCookie(sessionData, config, maxAge);
	}

	// If rolling is activated and the session exists we refresh the session on every request.
	if (config?.rolling) {
		if (typeof config.rolling === 'number' && sessionData?.expires) {
			// refreshes when a percentage of the expiration date is met
			const differenceInSeconds = Math.round(
				new Date(sessionData.expires).getTime() / 1000 - new Date().getTime() / 1000
			);

			if (differenceInSeconds < (config.rolling / 100) * config.cookie.maxAge) {
				await refreshSession();
			}
		} else {
			await refreshSession();
		}
	}

	if (state.destroy || state.invalidDate) {
		await destroySession();
	}
	if (state.reEncrypt) {
		await reEncryptSession();
	}

	return {
		session: {
			get shouldSync(): boolean {
				return shouldSync;
			},
			get 'set-cookie'(): string | undefined {
				return setCookieString;
			},
			get data(): any {
				return sessionData && !state.invalidDate && !state.destroy ? sessionData : {};
			},
			set: async function (data: SessionType) {
				await setSession(data);
				return sessionData;
			},
			update: async function (
				updateFn: (data: SessionType) => Partial<SessionType> | Promise<Partial<SessionType>>
			) {
				const sd = await updateFn(sessionData);
				await setSession({ ...sessionData, ...sd });
				return sessionData;
			},
			refresh: async function (expiresInDays?: number) {
				await refreshSession(expiresInDays);
				return true;
			},
			destroy: async function () {
				await destroySession();
				return true;
			}
		},
		cookies
	};
}

async function makeCookie(
	sessionData: any,
	config: NormalizedConfig,
	maxAge: number,
	destroy: boolean = false
) {
	const encode = async () => {
		return `${await encrypt(sessionData, config.secrets[0].secret as string)}&id=${
			config.secrets[0].id
		}`;
	};

	return serialize(config.key, destroy ? '0' : await encode(), {
		httpOnly: config.cookie.httpOnly,
		path: config.cookie.path,
		sameSite: config.cookie.sameSite,
		secure: config.cookie.secure,
		domain: config.cookie?.domain,
		maxAge: destroy ? undefined : maxAge,
		expires: destroy ? new Date(Date.now() - 360000000) : undefined
	});
}

async function getSessionData(
	sessionCookieString: string,
	secrets: Array<{ id: number; secret: BinaryLike }>
) {
	const [sessionCookie, secret_id] = sessionCookieString.split('&id=');

	const state = {
		invalidDate: false,
		reEncrypt: false,
		destroy: false
	};

	if (sessionCookie.length === 0) {
		return {
			state,
			data: {}
		};
	}

	// If we have a session cookie we try to get the id from the cookie value and use it to decode the cookie.
	// If the decodeID is not the first secret in the secrets array we should re encrypt to the newest secret.

	// Split the sessionCookie on the &id= field to get the id we used to encrypt the session.
	const decodeID = secret_id ? Number(secret_id) : 1;

	// Use the id from the cookie or the initial one which is always 1.
	let secret = secrets.find((sec) => sec.id === decodeID);

	// If there is no secret found try the first in the secrets array.
	if (!secret) secret = secrets[0];

	// Try to decode with the given sessionCookie and secret
	try {
		const decrypted = await decrypt(sessionCookie, secret.secret);

		if (
			decrypted &&
			decrypted.expires &&
			new Date(decrypted.expires).getTime() < new Date().getTime()
		) {
			state.invalidDate = true;
			state.destroy = true;
		}

		// If the decodeID unequals the newest secret id in the array, we should re-encrypt the session with the newest secret.
		if (secrets[0].id !== decodeID) {
			state.reEncrypt = true;
		}

		return {
			state,
			data: decrypted
		};
	} catch (error) {
		state.destroy = true;
		return {
			state,
			data: {}
		};
	}
}
