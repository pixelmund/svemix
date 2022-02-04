export { get, post, redirect } from './endpoint.js';
import type { MetaData } from '$lib/index.js';
import type { RequestEvent } from '@sveltejs/kit';

type MaybePromise<T> = T | Promise<T>;

export type Loader<Pr extends Record<any, any> = Record<any, any>> = (
	request: RequestEvent
) => MaybePromise<LoaderResult<Pr>>;

export type Action<
	Data extends Record<string, any> = Record<string, any>,
	Err extends Record<string, string> = Record<string, string>
> = (request: RequestEvent) => MaybePromise<ActionData<Data, Err>>;

export interface LoaderResult<Data extends Record<any, any> = Record<any, any>> {
	headers?: Record<string, string | string[]>;
	data?: Data;
	metadata?: MetaData;
	status?: number;
}

export interface ActionData<
	Data extends Record<any, any> = Record<any, any>,
	Err extends Record<string, string> = Record<string, string>
> {
	headers?: Record<string, string | string[]>;
	values?: Data;
	errors?: Err;
	status?: number;
	formError?: string;
}
