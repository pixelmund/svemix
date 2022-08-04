import { cookieSession } from './core.js';
import type { Handle } from '@sveltejs/kit';
import type { SessionOptions } from './types';

export function handleSession(
	options: SessionOptions,
	passedHandle: Handle = async ({ event, resolve }) => resolve(event)
): Handle {
	return async function handle({ event, resolve }) {
		const { session, cookies } = (await cookieSession(event.request.headers, options)) as any as {
			session: { 'set-cookie': string; data: any };
			cookies: Record<string, string>;
		};

		(event.locals as any).session = session;
		(event.locals as any).cookies = cookies;

		if (event.url.pathname === '/__session.json') {
			const getSession = options.getSession ?? (() => session.data);
			const sessionData = await getSession(event);
			return new Response(JSON.stringify(sessionData), {
				status: 200,
				// @ts-ignore
				headers: {
					'Content-Type': 'application/json',
					'Set-Cookie': session['set-cookie'] ? session['set-cookie'] : undefined
				}
			});
		}

		const response = await passedHandle({ event, resolve });

		if (!session['set-cookie']) {
			return response;
		}

		const sessionCookie = session['set-cookie'];
		response.headers.append('set-cookie', sessionCookie);

		return response;
	};
}

