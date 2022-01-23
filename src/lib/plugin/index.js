import { SVEMIX_DIR } from './constants.js';
import load_config from './load_config.js';
import Pipeline from './pipeline.js';
import fs from "fs";
import path from 'path';

import { TEMPLATE } from './_template/index.js';
import { writeFile } from './utils.js';

/**
 * @returns {import('vite').Plugin}
 */
export default function SvemixVitePlugin() {
	let config = null;

	const SVEMIX_HANDLE_FILE = path.resolve(SVEMIX_DIR, 'index.js');

	if (!fs.existsSync(SVEMIX_HANDLE_FILE)) {
		writeFile(SVEMIX_HANDLE_FILE, TEMPLATE()).then(() => {});
	}

	return {
		name: 'vite-plugin-svemix',
		enforce: 'pre',
		config(config) {
			return {
				...config,
				resolve: {
					alias: {
						...(config.resolve?.alias || {}),
						$svemix: SVEMIX_DIR
					}
				}
			};
		},
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
