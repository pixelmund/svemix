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

			const headers = new Headers({ 'Content-Type': 'application/json' });
			if (session['set-cookie'] && session['set-cookie'].length > 0) {
				headers.set('set-cookie', session['set-cookie']);
			}
			
			return new Response(JSON.stringify(await getSession(event)), {
				status: 200,
				headers
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

