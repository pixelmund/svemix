import type { EndpointOutput } from '@sveltejs/kit/types/endpoint';
import type { ServerRequest } from '@sveltejs/kit/types/hooks';

type Loader_Result = {
	headers?: Record<string, string | string[]>;
	props?: Record<any, any>;
	error?: string | Error;
	status?: number;
	redirect?: string;
	maxage?: string;
};

type Action_Result = {
	headers?: Record<string, string | string[]>;
	data?: Record<any, any>;
	errors?: Record<string, string>;
	formError?: string;
	redirect?: string;
	status?: number;
};

interface SvemixPostHandlerParams {
	action: (request: ServerRequest) => Promise<Action_Result> | Action_Result;
	request: ServerRequest<any, any>;
}

interface SvemixGetHandlerParams {
	loader: (request: ServerRequest) => Promise<Loader_Result> | Loader_Result;
	request: ServerRequest<any, any>;
	hasMeta: boolean;
	metadata: any;
}

export async function getHandler({
	loader,
	request,
	hasMeta,
	metadata
}: SvemixGetHandlerParams): Promise<EndpointOutput<any>> {
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
}

export async function postHandler({
	action,
	request
}: SvemixPostHandlerParams): Promise<EndpointOutput<any>> {
	const loaded = await action(request);

	// This is a browser fetch
	if (request.headers && request.headers?.accept === 'application/json') {
		return {
			headers: loaded?.headers || {},
			body: {
				redirect: loaded?.redirect,
				formError: loaded?.formError,
				data: loaded?.data,
				errors: loaded?.errors,
				status: loaded?.status
			}
		};
	}

	// This is the default form behaviour, navigate back to form submitter
	if (!loaded?.redirect) {
		return {
			headers: {
				...(loaded?.headers || {}),
				Location: request.headers?.referer
			},
			status: loaded?.status || 302,
			body: {}
		};
	}

	return {
		headers: {
			...(loaded?.headers || {}),
			Location: loaded?.redirect
		},
		status: loaded?.status || 302,
		body: {}
	};
}
