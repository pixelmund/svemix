export { get, post } from './endpoint.js';
import type { MetaData } from '$lib/meta/index.js';
import type { RequestEvent, ServerLoad, ServerLoadEvent as KitServerLoadEvent } from '@sveltejs/kit';

export type MaybePromise<T> = T | Promise<T>;
export type Loader = ServerLoad;
export type ServerLoadEvent = KitServerLoadEvent;

export interface Action<
	Params extends Partial<Record<string, string>> = Partial<Record<string, string>>
> {
	(event: RequestEvent<Params>): MaybePromise<
		| { status?: number; errors: Record<string, any>; location?: never }
		| { status?: never; errors?: never; location: string }
		| void
	>;
}

export type MetaFn = (event: ServerLoadEvent, result: Record<string, any>) => MaybePromise<MetaData>
