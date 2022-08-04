import path from 'path';
import fs from 'fs';
import url from 'url';
import { SVEMIX_GENERATED_DIR } from './constants.js';

/**
 * @type { import('../types').InternalConfig }
 */
export const defaultConfig = {
	routes: 'src/routes',
	seo: {}
};

/**
 *
 * @param {import('vite').UserConfig} config
 * @returns {import('vite').UserConfig}
 */
export function viteConfig(config) {
	return {
		...config,
		resolve: {
			alias: {
				...(config.resolve?.alias || {}),
				$svemix: SVEMIX_GENERATED_DIR
			}
		}
	};
}

export default async function loadConfig({ cwd = process.cwd() } = {}) {
	const svelte_config_file = path.join(cwd, 'svelte.config.js');
	const config_file = fs.existsSync(svelte_config_file) ? svelte_config_file : null;

	let config;

	if (config_file) {
		const loaded_config = await import(url.pathToFileURL(config_file).href);

		/**
		 * @type {import('../types').SvemixConfig}
		 */
		const svelte_config = loaded_config?.default;

		if (typeof svelte_config !== 'object') {
			config = defaultConfig;
			return config;
		}

		config = {
			...defaultConfig,
			routes: svelte_config?.kit?.files?.routes
				? svelte_config?.kit?.files?.routes
				: defaultConfig.routes,
			...svelte_config.svemix
		};
	} else {
		// Default config
		config = defaultConfig;
	}

	return config;
}
