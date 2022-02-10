import type { RequestHandler } from '@sveltejs/kit';
import type { Action, Loader } from '.';

interface RedirectOptions {
	status: number;
	headers?: Record<string, string | string[]>;
}

interface RedirectResult {
	status: number;
	headers: Record<string, string | string[]>;
}

export function redirect(path: string, optsOrStatus: number | RedirectOptions): RedirectResult {
	const isOptions = typeof optsOrStatus !== 'number';
	const status = isOptions ? optsOrStatus.status : optsOrStatus;
	const optionHeaders = isOptions ? optsOrStatus?.headers || {} : {};

	const headers = { ...optionHeaders, 'x-svemix-location': path, location: path };

	return { status: status || 302, headers };
}

export function get(loader: Loader): RequestHandler<any> {
	return async (event) => {
		const loaded = await loader(event);

		const { headers, status, metadata, ...data } = loaded;

		return {
			status: status || 200,
			headers: headers || {},
			body: {
				data,
				metadata
			}
		};
	};
}

export function post(action: Action): RequestHandler<any> {
	return async (event) => {
		const actionResult = await action(event);
		const status = actionResult?.status || 200;
		const shouldRedirect = status >= 300 && status < 400;

		// If we have a redirect
		if (shouldRedirect) {
			const location =
				actionResult.headers['x-svemix-location'] || actionResult.headers['location'];

			// If the user has javascript disabled
			if (!event.request.headers.get('accept').includes('application/json')) {
				return {
					status,
					headers: {
						...actionResult.headers,
						location
					}
				};
			}

			return {
				status: 204,
				headers: {
					...actionResult.headers,
					'x-svemix-location': location
				}
			};
		}

		const hasSession = 'session' in event.locals;

		let shouldSendSession = false;

		if (hasSession) {
			shouldSendSession = event.locals.session?.shouldSendToClient;
		}

		const { headers: _headers, status: _status, ...actionData } = actionResult;

		return {
			status,
			headers: {
				...actionResult.headers,
				'content-type': 'application/json; charset=utf-8',
				'x-svemix-refresh-session': shouldSendSession ? 'true' : 'false'
			},
			body: {
				actionData
			}
		};
	};
}
