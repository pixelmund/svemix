import CookieSession from './core';
import type { Handle } from '@sveltejs/kit';
import type { SessionOptions } from './types';

export function handleSession(
	options: SessionOptions,
	passedHandle: Handle = async ({ event, resolve }) => resolve(event)
) {
	return async function handle({ event, resolve }) {
		const session = CookieSession(event, options);
		event.locals.session = session;

		const getSession = options?.getSession || (() => session.data);

		if (event.url.pathname === '/__session.json' && event.request.method === 'GET') {
			return new Response(JSON.stringify({ data: await getSession(event) }), {
				headers: {
					'set-cookie': session['set-cookie'] ? session['set-cookie'] : undefined,
					'content-type': 'application/json'
				}
			});
		}

		const response = await passedHandle({ event, resolve });

		if (!session['set-cookie'] || !response?.headers) {
			return response;
		}

		const sessionCookie = session['set-cookie'];
		response.headers.append('set-cookie', sessionCookie);

		return response;
	} as Handle;
}
