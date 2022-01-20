import CookieSession from './core';
export function handleSession(
	options,
	passedHandle = async ({ event, resolve }) => resolve(event)
) {
	return async function handle({ event, resolve }) {
		// We type it as any here to avoid typescript complaining about set-cookie;
		const session = CookieSession(event.request.headers, options);
		event.locals.session = session;
		const response = await passedHandle({ event, resolve });
		if (!session['set-cookie'] || !response?.headers) {
			return response;
		}
		const sessionCookie = session['set-cookie'];
		response.headers.append('set-cookie', sessionCookie);
		return response;
	};
}
