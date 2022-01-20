import { decrypt, encrypt } from './crypto.js';
import { parse, serialize } from './cookie.js';
import type { Session, SessionOptions } from './types';
import { daysToMaxage, maxAgeToDateOfExpiry } from './utils.js';

export default function CookieSession<SessionType = Record<string, any>>(
	headers: Headers,
	userOptions: SessionOptions
): Session<SessionType> {
	if (userOptions.secret == null) {
		throw new Error('Please provide at least one secret');
	}

	const core = {
		key: userOptions.key ?? 'kit.session',
		expiresInDays: userOptions.expires ?? 7,
		cookie: {
			maxAge: daysToMaxage(userOptions.expires ?? 7),
			httpOnly: userOptions?.cookie?.httpOnly ?? true,
			sameSite: userOptions?.cookie?.sameSite ?? true,
			path: userOptions?.cookie?.path ?? '/'
		},
		rolling: userOptions?.rolling ?? false,
		secrets: Array.isArray(userOptions.secret)
			? userOptions.secret
			: [{ id: 1, secret: userOptions.secret }]
	};

	let encoder = encrypt(core.secrets[0].secret);
	let decoder = decrypt(core.secrets[0].secret);

	const cookies = parse(headers.get('cookie') || '', {});

	let sessionCookie: string = cookies[core.key] || '';
	const sessionStatus = {
		invalidDate: false,
		shouldReEncrypt: false,
		shouldDestroy: false,
		shouldSendToClient: false
	};

	let sessionData: (SessionType & { expires?: Date }) | undefined;

	// If we have a session cookie we try to get the id from the cookie value and use it to decode the cookie.
	// If the decodeID is not the first secret in the secrets array we should re encrypt to the newest secret.
	if (sessionCookie.length > 0) {
		// Split the sessionCookie on the &id= field to get the id we used to encrypt the session.
		const [_sessionCookie, id] = sessionCookie.split('&id=');

		const decodeID = id ? Number(id) : 1;

		// Use the id from the cookie or the initial one which is always 1.
		let secret = core.secrets.find((sec) => sec.id === decodeID);

		// If there is no secret found try the first in the secrets array.
		if (!secret) secret = core.secrets[0];

		// Set the session cookie without &id=
		sessionCookie = _sessionCookie;

		// If the decodeID unequals the newest secret id in the array, re initialize the decoder.
		if (core.secrets[0].id !== decodeID) {
			decoder = decrypt(secret.secret);
		}

		// Try to decode with the given sessionCookie and secret
		try {
			const decrypted = decoder(sessionCookie);
			if (decrypted && decrypted.length > 0) {
				sessionData = JSON.parse(decrypted);
				// If the decodeID unequals the newest secret id in the array, we should re-encrypt the session with the newest secret.
				if (core.secrets[0].id !== decodeID) {
					sessionStatus.shouldReEncrypt = true;
				}
			} else {
				sessionStatus.shouldDestroy = true;
			}
		} catch (error) {
			sessionStatus.shouldDestroy = true;
		}
	}

	// Check if the session is already expired
	if (
		sessionData &&
		sessionData.expires &&
		new Date(sessionData.expires).getTime() < new Date().getTime()
	) {
		sessionStatus.invalidDate = true;
	}

	function makeCookie(maxAge: number, destroy: boolean = false) {
		return serialize(
			core.key,
			destroy
				? '0'
				: JSON.stringify(encoder(JSON.stringify(sessionData) || '')) + '&id=' + core.secrets[0].id,
			{
				httpOnly: core.cookie.httpOnly,
				sameSite: core.cookie.sameSite,
				path: core.cookie.path,
				maxAge: destroy ? undefined : maxAge,
				expires: destroy ? new Date(Date.now() - 360000000) : undefined
			}
		);
	}

	const session: { 'set-cookie'?: string } = {};

	const sessionProxy = new Proxy(session, {
		set: function (obj, prop, value) {
			if (prop === 'data') {
				let maxAge = core.cookie.maxAge;

				if (sessionData?.expires) {
					maxAge = new Date(sessionData.expires).getTime() / 1000 - new Date().getTime() / 1000;
				}

				sessionData = {
					...value,
					expires: maxAgeToDateOfExpiry(maxAge)
				};

				sessionStatus.shouldSendToClient = true;

				obj['set-cookie'] = makeCookie(maxAge);
			}

			return true;
		},
		get: function (obj, prop) {
			switch (prop) {
				case 'shouldSendToClient':
					return sessionStatus.shouldSendToClient;

				case 'data':
					return sessionData && !sessionStatus.invalidDate && !sessionStatus.shouldDestroy
						? sessionData
						: {};

				case 'refresh':
					return (expiresInDays?: number) => {
						if (!sessionData) {
							return false;
						}

						const newMaxAge = daysToMaxage(expiresInDays ?? core.expiresInDays);

						sessionData = {
							...sessionData,
							expires: maxAgeToDateOfExpiry(newMaxAge)
						};

						obj['set-cookie'] = makeCookie(newMaxAge);

						sessionStatus.shouldSendToClient = true;

						return true;
					};

				case 'destroy':
					return () => {
						if (sessionCookie.length === 0) return false;
						//@ts-ignore
						sessionData = {};
						obj['set-cookie'] = makeCookie(0, true);
						sessionStatus.shouldSendToClient = true;
						return true;
					};

				default:
					return (obj as any)[prop];
			}
		}
	}) as any;

	// If we have an invalid date or shouldDestroy is set to true we destroy the session.
	if (sessionStatus.invalidDate || sessionStatus.shouldDestroy) {
		sessionStatus.shouldSendToClient = true;
		sessionProxy.destroy();
	}
	// If rolling is activated and the session exists we refresh the session on every request.
	if (userOptions?.rolling && !sessionStatus.invalidDate && sessionData) {
		sessionProxy.refresh();
	}
	// Check if we have to re encrypt the data
	if (sessionStatus.shouldReEncrypt && sessionData) {
		sessionStatus.shouldSendToClient = true;
		sessionProxy.data = { ...sessionData };
	}

	return sessionProxy;
}
