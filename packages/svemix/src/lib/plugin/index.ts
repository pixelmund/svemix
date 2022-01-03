import load_config from './load_config.js';
import Pipeline from './pipeline/index.js';
import type { Plugin } from 'vite';

export type { SvemixConfig } from './load_config';

export default function SvemixVitePlugin(): Plugin {
	let config = null;

	return {
		name: 'vite-plugin-svemix',
		enforce: 'pre',
		async transform(src, id) {

			if (!config) {
				config = await load_config();
			}

			const result = await Pipeline({
				config,
				doc: {
					filename: id,
					content: src,
					scripts: { arr: [] },
					prerender: false,
					functions: { action: false, loader: false, metadata: false },
					route: {}
				}
			});

			return {
				code: result.code,
				map: null
			};
		}
	};
}
