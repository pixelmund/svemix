import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import svemix from 'vite-plugin-svemix';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		}),
	],

	kit: {
		adapter: adapter({}),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			plugins: [svemix({})]
		}
	}
};

export default config;
