import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: adapter(),
		prerender: {
			entries: ['*', '/content.json']
		},
		vite: {
			fs: {
				strict: false
			}
		}
	}
};

export default config;
