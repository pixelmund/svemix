export { get, post, redirect } from './endpoint.js';
import type { MetaData } from '$lib/index.js';
import type { RequestEvent } from '@sveltejs/kit';

export type MaybePromise<T> = T | Promise<T>;

type ActionOutput = {
	headers?: Headers | Record<string, string | string[]>;
	status?: number;
	[key: string]: any;
};

export type Action<Output extends ActionOutput = ActionOutput> = (
	request: RequestEvent
) => MaybePromise<Output>;

export type LoaderResult<Data extends Record<string, any> = Record<string, any>> = Data & {
	headers?: Record<string, string | string[]>;
	metadata?: MetaData;
	status?: number;
};

export type Loader<Pr extends Record<any, any> = Record<any, any>> = (
	request: RequestEvent
) => MaybePromise<LoaderResult<Pr>>;
