import type { BinaryLike, SessionOptions } from './types';

export function daysToMaxage(days: number) {
	var today = new Date();
	var resultDate = new Date(today);
	resultDate.setDate(today.getDate() + days);

	return resultDate.getTime() / 1000 - today.getTime() / 1000;
}

export function maxAgeToDateOfExpiry(maxAge: number) {
	return new Date(Date.now() + maxAge * 1000);
}

export interface Secret {
	id: number;
	secret: BinaryLike;
}

export interface NormalizedConfig {
	key: string;
	expiresInDays: number;
	cookie: {
		maxAge: number;
		httpOnly: boolean;
		sameSite: any;
		path: string;
		domain: string | undefined;
		secure: boolean;
	};
	rolling: number | boolean | undefined;
	secrets: Array<Secret>;
}

export function normalizeConfig(options: SessionOptions) : NormalizedConfig {
	if (options.secret == null) {
		throw new Error('Please provide at least one secret');
	}

	const isSecureCookie =
		typeof process !== 'undefined' ? process.env.NODE_ENV !== 'development' : false;

	return {
		key: options.key || 'kit.session',
		expiresInDays: options.expires || 7,
		cookie: {
			maxAge: daysToMaxage(options.expires || 7),
			httpOnly: options?.cookie?.httpOnly ?? true,
			sameSite: options?.cookie?.sameSite || 'lax',
			path: options?.cookie?.path || '/',
			domain: options?.cookie?.domain || undefined,
			secure: options?.cookie?.secure ?? isSecureCookie
		},
		rolling: options?.rolling ?? false,
		secrets: Array.isArray(options.secret) ? options.secret : [{ id: 1, secret: options.secret }]
	};
}
