import { sveltekit } from '@sveltejs/kit/vite';
import svemix from './src/lib/plugin/index.js';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [svemix(), sveltekit()],
	server: {
		watch: {
			alwaysStat: true
		}
	}
};

export default config;

