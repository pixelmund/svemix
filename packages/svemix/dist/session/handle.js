import CookieSession from './core';
export function handleSession(options, passedHandle = async ({ request, resolve }) => resolve(request)) {
    return async function handle({ request, resolve }) {
        // We type it as any here to avoid typescript complaining about set-cookie;
        const session = CookieSession(request.headers, options);
        request.locals.session = session;
        const response = await passedHandle({ request, resolve });
        if (!session['set-cookie'] || !response?.headers) {
            return response;
        }
        if (response.headers['set-cookie']) {
            if (typeof response.headers['set-cookie'] === 'string') {
                response.headers['set-cookie'] = [
                    response.headers['set-cookie'],
                    session['set-cookie']
                ];
            }
            else if (Array.isArray(response.headers['set-cookie'])) {
                response.headers['set-cookie'] = [
                    ...response.headers['set-cookie'],
                    session['set-cookie']
                ];
            }
        }
        else {
            response.headers['set-cookie'] = [session['set-cookie']];
        }
        return response;
    };
}
