export { getHandler, postHandler } from './endpoint.js';
import type { RequestEvent } from '@sveltejs/kit';

type MaybePromise<T> = T | Promise<T>;

export type Loader<Pr extends Record<any, any> = Record<any, any>, Locals = Record<string, any>> = (
	request: RequestEvent<Locals>
) => MaybePromise<LoaderResult<Pr>>;

export type Action<
	Data extends Record<string, any> = Record<string, any>,
	Locals = Record<string, any>
> = (request: RequestEvent<Locals>) => MaybePromise<ActionResult<Data, Record<keyof Data, string>>>;

export interface LoaderResult<Pr extends Record<any, any> = Record<any, any>> {
	headers?: Record<string, string | string[]>;
	props?: Pr;
	error?: string | Error;
	status?: number;
	redirect?: string;
	maxage?: string;
}

export interface ActionResult<
	Data extends Record<any, any> = Record<any, any>,
	Err extends Record<string, string> = Record<string, string>
> {
	headers?: Record<string, string | string[]>;
	data?: Data;
	errors?: Err;
	redirect?: string;
	formError?: string;
	status?: number;
}
