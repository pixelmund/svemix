export { default as Form } from './form/Form.svelte';
export { Meta } from './meta/index.js';
export { default as SvemixRoot } from './root.svelte';
export { redirect } from './core/utils.js';
export { error } from '@sveltejs/kit';

export type { MetaData } from './meta';
export type { SvemixConfig } from './plugin/types';
export type { Action, Loader, ServerLoadEvent, MetaFn } from './core';
