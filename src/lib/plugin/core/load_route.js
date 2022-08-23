import { getScripts, SVEMIX_LIB_DIR } from '../utils/index.js';
import { routeManager } from '../utils/route_manager.js';

/**
 *
 * @returns {(id: string) => {code: string} | null}
 */
export function loadRoute() {
	return (id) => {
		if (!id.includes('routes')) return null;

		const routeId = id.split('src/routes/').pop();
		if (!routeId) return null;

		const route = routeManager.get(routeId);
		if (!route) return null;

		let content = route.content();

		if (id.endsWith('+page.svelte') && typeof content === 'string') {
			return {
				code: content
			}
		}
		if ((id.endsWith('+page.server.ts') || id.endsWith('page.server.js')) && typeof content === 'string') {
			const scripts = getScripts(content);
			const ssrScript = scripts.find(
				(script) => script.attrs?.context === 'module' && script.attrs?.ssr
			);

			if (!ssrScript) return { code: '' };

			const ssrContent = ssrScript.content;

			const hasLoader = checkForSvemixKeyword('loader', ssrContent);
			const hasAction = checkForSvemixKeyword('action', ssrContent);
			const hasMetaFn = checkForSvemixKeyword('metadata', ssrContent);

			return {
				code: `
				import { get as __get, post as __post } from '${SVEMIX_LIB_DIR}/server';
				${ssrScript.content}
				${hasLoader && !hasMetaFn ? 'export const load = __get(loader, () => ({}));' : ''}
				${hasLoader && hasMetaFn ? 'export const load = __get(loader, metadata);' : ''}
				${!hasLoader && hasMetaFn ? 'export const load = __get(() => ({}), metadata);' : ''}
				${hasAction ? 'export const POST = __post(action);' : ''}
				`
			};
		}

		return null;
	};
}

/**
 *
 * @param {string} keyword
 * @param {string} content
 * @returns {boolean}
 */
function checkForSvemixKeyword(keyword, content) {
	const svemixKeywords = [
		`export const ${keyword}`,
		`export let ${keyword}`,
		`export function ${keyword}`,
		`export async function ${keyword}`
	];

	let seen = false;

	svemixKeywords.forEach((key) => {
		if (content.includes(key)) {
			seen = true;
		}
	});

	return seen;
}

