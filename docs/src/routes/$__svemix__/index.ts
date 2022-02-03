import * as svemixHandlers from 'svemix/server';

import type { MetaFunction } from 'svemix';
export const prerender = true;

export const loader = () => ({});

export const metadata: MetaFunction<any> = () => ({
	title: 'The Full-Stack addition to SvelteKit - SVEMIX',
	description:
		'The Full-Stack addition to SvelteKit. Write your server code inside .svelte files, handle sessions, forms and SEO easily.'
});

export const get = svemixHandlers.getHandler({
	hasMeta: true,
	loader: loader,
	metadata: metadata
});
