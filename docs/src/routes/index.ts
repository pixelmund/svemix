import { get as __get, post as __post } from 'svemix/server';

import type { Loader } from 'svemix';

export const loader: Loader = () => ({
	metadata: {
		title: 'The Full-Stack addition to SvelteKit - SVEMIX',
		description:
			'The Full-Stack addition to SvelteKit. Write your server code inside .svelte files, handle sessions, forms and SEO easily.'
	}
});

export const get = __get(loader);
