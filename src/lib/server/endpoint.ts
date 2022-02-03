import type { RequestHandler } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit/types/hooks';
import type { ActionData, LoaderResult } from '.';

type SvemixAction = (event: RequestEvent) => Promise<ActionData> | ActionData;
type SvemixLoader = (event: RequestEvent) => Promise<LoaderResult> | LoaderResult;

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

	const headers = { ...optionHeaders, location: path };

	return {
		status,
		headers
	};
}

export function get(loader: SvemixLoader): RequestHandler<any> {
	return async (event) => {
		const loaded = await loader(event);
		const status = loaded?.status || 200;

		if (status > 300 && status < 400) {
			return {
				status,
				headers: loaded.headers
			};
		}

		const loaderData = loaded?.data || {};
		const loaderMetadata = loaded?.metadata || {};

		return {
			status: loaded?.status,
			headers: loaded?.headers || {},
			body: {
				loaderData: { ...loaderData },
				metadata: loaderMetadata
			}
		};
	};
}

export function post(action: SvemixAction): RequestHandler<any> {
	return async (event) => {
		const actionResult = await action(event);

		if (!event.request.headers.get('accept').includes('application/json')) {
			const status = actionResult?.status || 200;
			if (status > 300 && status < 400) {
				return {
					status,
					headers: actionResult.headers
				};
			}
		}

		const hasSession = 'session' in event.locals;

		let shouldSendSession = false;

		if (hasSession) {
			// @ts-ignore I promise this exists
			shouldSendSession = event.locals.session.shouldSendToClient;
		}

		return {
			status: 200,
			headers: actionResult?.headers || {},
			body: {
				actionData: {
					formError: actionResult?.formError,
					data: actionResult?.data,
					errors: actionResult?.errors,
					redirect: actionResult?.headers?.location,
					// TODO: this should somehow execute the users hooks getSession, or the user has to define it inside the svelte.config.js?,
					session: {
						status: shouldSendSession ? 'should-update' : 'no-changes',
						// @ts-ignore I promise this exists
						data: shouldSendSession ? event.locals.session?.data : {}
					}
				}
			}
		};
	};
}
