import type { RequestHandler } from '@sveltejs/kit/types/endpoint';
import type { ServerRequest } from '@sveltejs/kit/types/hooks';
import type { ActionResult, LoaderResult } from '.';
import type { MetaFunction } from '../meta';

interface SvemixPostHandlerParams {
	action: (request: ServerRequest) => Promise<ActionResult> | ActionResult;
}

interface SvemixGetHandlerParams {
	loader: (request: ServerRequest) => Promise<LoaderResult> | LoaderResult;
	hasMeta: boolean;
	metadata: MetaFunction<any>;
}

export function getHandler({
	hasMeta,
	loader,
	metadata
}: SvemixGetHandlerParams): RequestHandler<any, any, any> {
	return async (request) => {
		const loaded = await loader(request);

		if (loaded?.error || loaded?.redirect) {
			return {
				headers: loaded?.headers || {},
				body: {
					props: { _metadata: {} },
					error: loaded?.error,
					status: loaded?.status,
					redirect: loaded?.redirect,
					maxage: loaded?.maxage
				}
			};
		}

		let _metadata = {};

		if (hasMeta) {
			_metadata = await metadata(loaded?.props);
		}

		const loadedProps = loaded?.props || {};
		const metaProps = { _metadata };

		return {
			headers: loaded?.headers || {},
			body: {
				props: { ...loadedProps, ...metaProps },
				error: loaded?.error,
				status: loaded?.status,
				redirect: loaded?.redirect,
				maxage: loaded?.maxage
			}
		};
	};
}

export function postHandler({ action }: SvemixPostHandlerParams): RequestHandler<any, any, any> {
	return async (request) => {
		const actionResult = await action(request);

		// This is a browser fetch
		if (request.headers && request.headers?.accept === 'application/json') {
			const hasSession = 'session' in request.locals;

			let shouldSendSession = false;

			if (hasSession) {
				shouldSendSession = request.locals.session.shouldSendToClient;
			}

			return {
				headers: actionResult?.headers || {},
				body: {
					redirect: actionResult?.redirect,
					formError: actionResult?.formError,
					data: actionResult?.data,
					errors: actionResult?.errors,
					status: actionResult?.status,
					// TODO: this should somehow execute the users hooks getSession, or the user has to define it inside the svelte.config.js?,
					session: {
						status: shouldSendSession ? 'should-update' : 'no-changes',
						data: shouldSendSession ? request.locals.session?.data : {}
					}
				}
			};
		}

		// This is the default form behaviour, navigate back to form submitter
		if (!actionResult?.redirect) {
			return jsDisabledFormRedirect(request, actionResult);
		}

		return {
			headers: {
				...(actionResult?.headers || {}),
				Location: actionResult?.redirect
			},
			status: actionResult?.status || 302,
			body: {}
		};
	};
}

function jsDisabledFormRedirect(
	request: ServerRequest<any, any>,
	actionResult: ActionResult<any, any>
) {
	let location = request.headers?.referer;

	const params = new URLSearchParams();

	if (actionResult?.errors) {
		Object.keys(actionResult.errors).forEach((key) => {
			const value = actionResult.errors[key];
			if (value && value.length > 0) {
				params.append(`errors[]`, `${key}::${value}`);
			}
		});
	}

	if (actionResult?.formError && actionResult.formError.length > 0) {
		params.append(`formError`, actionResult.formError);
	}

	if (actionResult?.data) {
		Object.keys(actionResult.data).forEach((key) => {
			const value = actionResult.data[key];
			if (value && value.length > 0) {
				params.append(`data[]`, `${key}::${value}`);
			}
		});
	}

	if (location.includes('?')) {
		const [referer] = location.split('?');
		location = referer;
	}

	const searchParams = params.toString();

	if (searchParams.length > 0) {
		location += '?' + searchParams;
	}

	return {
		headers: {
			...(actionResult?.headers || {}),
			Location: location
		},
		status: actionResult?.status || 302,
		body: {}
	};
}
