import { getScripts, SCRIPTS_REGEX, SVEMIX_LIB_DIR } from '../utils/index.js';
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
				content = transformInstanceScript(script);
			}

			return content;
		});

		if (!scripts.find((script) => !script.attrs?.context)) {
			code = `
				${code}
				${transformInstanceScript({ content: '', attrs: {} })}
			`;
		}

		return {
			code,
			map: null
		};
	};
}

/**
 *
 * @param {import('../types').ParsedScript} script
 * @returns {string}
 */
const transformInstanceScript = (script) => {
	return `
		<script ${script.attrs?.lang === 'ts' ? 'lang="ts"' : ''}>
			import { Meta as SvemixMeta } from "${SVEMIX_LIB_DIR}"; 
			${script.content || ''}
		</script>
		<SvemixMeta />
   `;
};

