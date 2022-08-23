import { getScripts, SCRIPTS_REGEX } from '../utils/index.js';
import { transformRootFile } from './transform_root.js';

/**
 *  @param {import('../types').InternalConfig | null} config
 * @returns {(src: string, id: string) => {code: string} | null}
 */
export function transformRoute(config) {
	return (src, id) => {

		if (id.endsWith('/generated/root.svelte')) {
			return { code: transformRootFile(src), map: null };
		}

		if (!id.includes(config?.routes || 'routes') || !id.includes('.svelte')) {
			return {
				code: src
			};
		}

		const scripts = getScripts(src);
		let scriptsIndex = 0;

		let code = src.replace(SCRIPTS_REGEX, (content, _attrs, _scripts_inner_content) => {
			const script = scripts[scriptsIndex++];

			if (script.attrs.ssr) {
				content = '';
			} else if (script.attrs.context) {
			} else {
			}

			return content;
		});

		return {
			code,
			map: null
		};
	};
}

