import { loadConfig, viteConfig } from './utils/index.js';
import { initializeSvemix, resolveRoute, loadRoute, transformRoute } from './core/index.js';
import { posixify } from './utils/misc.js';

/**
 * @returns {import('vite').Plugin[]}
 */
export default function SvemixVitePlugin() {
	/**
	 * @type {import('./types').InternalConfig | null}
	 */
	let svemixConfig = null;

	return [
		{
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
		},
		{
			name: 'vite-plugin-svemix-hmr',
			enforce: 'post',
			async handleHotUpdate({ file, server }) {
				if (posixify(file).includes('/routes/')) {
					await server.restart();
					return server.ws.send({ type: 'full-reload' })
				}
			}
		}
	];
}
