import { getScripts, SCRIPTS_REGEX } from '../../utils/index.js';
import { patchNavigationFile } from './navigation_patch.js';
import { transformRootFile } from './root_patch.js';

/**
 *  @param {import('../../types').InternalConfig | null} config
 * @returns {(src: string, id: string) => {code: string} | null}
 */
export function transform(config) {
	return (src, id) => {
		// This is necessary to avoid some race conditions, don't know exactly why:
		if (id.endsWith('navigation.js')) {
			return {
				code: patchNavigationFile()
			};
		}

		if (id.endsWith('/generated/root.svelte')) {
			return { code: transformRootFile(src), map: null };
		}

		if (!id.includes('src/routes')) {
			return {
				code: src
			};
		}

		if (!id.includes('.svelte')) {
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

