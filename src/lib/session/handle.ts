import CookieSession from './core';
import type { Handle } from '@sveltejs/kit';
import type { SessionOptions } from './types';

export function handleSession(
	options: SessionOptions,
	passedHandle: Handle = async ({ event, resolve }) => resolve(event)
) {
	return async function handle({ event, resolve }) {
		// We type it as any here to avoid typescript complaining about set-cookie;
		const session: any = CookieSession(event.request.headers, options);
		event.locals.session = session;

		const response = await passedHandle({ event, resolve });

		if (!session['set-cookie'] || !response?.headers) {
			return response;
		}

		const sessionCookie = session['set-cookie'];
		response.headers.append('set-cookie', sessionCookie);

		return response;
	} as Handle;
}
