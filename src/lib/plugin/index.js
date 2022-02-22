import { SVEMIX_GENERATED_DIR, SVEMIX_GENERATED_INDEX } from './constants.js';
import load_config from './load_config.js';
import Pipeline from './pipeline.js';
import { stringifyObject, writeFile } from './utils.js';

/**
 * @returns {import('vite').Plugin}
 */
export default function SvemixVitePlugin() {
	let config = null;

	return {
		name: 'vite-plugin-svemix',
		enforce: 'pre',
		config(config) {
			return {
				...config,
				resolve: {
					alias: {
						...(config.resolve?.alias || {}),
						$svemix: SVEMIX_GENERATED_DIR
					}
				}
			};
		},
		async transform(src, id) {
			if (!config) {
				config = await load_config();
				await initialize(config);
			}

			const { code } = await Pipeline({
				config,
				doc: {
					filename: id,
					content: src,
					scripts: { arr: [] },
					functions: { action: false, loader: false }
				}
			});

			return {
				code,
				map: null
			};
		}
	};
}

/**
 *
 * @param {import('./config').InternalConfig} config
 */
async function initialize(config) {
	await writeFile(
		SVEMIX_GENERATED_INDEX,
		`export const metaDefaults = ${stringifyObject(config.seo || {})}`
	);
}
