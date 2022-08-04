import { loadConfig, viteConfig } from './utils/index.js';
import { initializeSvemix, resolveRoute, loadRoute, transformRoute } from './core/index.js';

/**
 * @returns {import('vite').Plugin}
 */
export default function SvemixVitePlugin() {
	/**
	 * @type {import('./types').InternalConfig | null}
	 */
	let svemixConfig = null;

	return {
		name: 'vite-plugin-svemix',
		enforce: 'pre',
		async config(config) {
			svemixConfig = await loadConfig();
			await initializeSvemix(svemixConfig);
			return viteConfig(config);
		},
		resolveId: resolveRoute(),
		load: loadRoute(),
		transform: transformRoute(svemixConfig)
	};
}
