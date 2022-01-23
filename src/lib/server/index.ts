export { serverHandler, get_parts, get_pattern, get_params, decode_params } from './endpoint.js';
import type { RequestEvent } from '@sveltejs/kit';
export type { SvemixRoutes } from './endpoint';

type MaybePromise<T> = T | Promise<T>;

export type Loader<Pr extends Record<any, any> = Record<any, any>, Locals = Record<string, any>> = (
	request: RequestEvent<Locals>
) => MaybePromise<LoaderResult<Pr>>;

export type Action<
	Data extends Record<string, any> = Record<string, any>,
	Locals = Record<string, any>
> = (request: RequestEvent<Locals>) => MaybePromise<ActionResult<Data>>;

export interface LoaderResult<Pr extends Record<any, any> = Record<any, any>> {
	headers?: Record<string, string | string[]>;
	props?: Pr;
	error?: string | Error;
	status?: number;
	redirect?: string;
	maxage?: string;
}

export interface ActionResult<
	Data extends Record<any, any> = Record<any, any>
> {
	headers?: Record<string, string | string[]>;
	data?: Data;
	errors?: Record<string, string>;
	redirect?: string;
	formError?: string;
	status?: number;
}
