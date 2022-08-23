export { get, post } from './endpoint.js';
import type { MetaData } from '$lib/meta/index.js';
import type { Action as KitAction, ServerLoad, ServerLoadEvent as KitServerLoadEvent } from '@sveltejs/kit';

export type MaybePromise<T> = T | Promise<T>;
export type Loader = ServerLoad;
export type ServerLoadEvent = KitServerLoadEvent;
export type Action = KitAction;
export type MetaFn = (event: ServerLoadEvent, result: Record<string, any>) => MaybePromise<MetaData>
