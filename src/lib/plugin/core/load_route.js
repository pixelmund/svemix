import { SVEMIX_LIB_DIR } from '../utils/index.js';
import { routeManager } from '../utils/route_manager.js';

/**
 *
 * @returns {(id: string) => {code: string} | null}
 */
export function loadRoute() {
	return (id) => {
		if (!id.includes('src/routes')) return null;

		const routeId = routeManager.parseRouteId(id);
		if (!routeId) return null;

		const route = routeManager.get(routeId);
		if (!route) return null;

		if (route.isLayout) {
			if (id.endsWith('.svelte')) {
				return {
					code: route.content()
				};
			} else {
				const { available, content } = route.serverScript();
				if (!available) return { code: '' };

				const has = checkSvemixKeywords(content);

				return {
					code: `
					import { get as __get, post as __post } from '${SVEMIX_LIB_DIR}/server';
					${content}
					${has.loader && !has.metadata ? 'export const load = __get(loader, () => ({}));' : ''}
					${has.loader && has.metadata ? 'export const load = __get(loader, metadata);' : ''}
					${!has.loader && has.metadata ? 'export const load = __get(() => ({}), metadata);' : ''}
					${has.action ? 'export const POST = __post(action);' : ''}
					`
				};
			}
		} else if (id.endsWith('+page.svelte')) {
			return {
				code: route.content()
			};
		} else if (id.endsWith('+page.server.ts') || id.endsWith('page.server.js')) {
			const { available, content } = route.serverScript();
			if (!available) return { code: '' };

			const has = checkSvemixKeywords(content);

			return {
				code: `
				import { get as __get, post as __post } from '${SVEMIX_LIB_DIR}/server';
				${content}
				${has.loader && !has.metadata ? 'export const load = __get(loader, () => ({}));' : ''}
				${has.loader && has.metadata ? 'export const load = __get(loader, metadata);' : ''}
				${!has.loader && has.metadata ? 'export const load = __get(() => ({}), metadata);' : ''}
				${has.action ? 'export const POST = __post(action);' : ''}
				`
			};
		}

		return null;
	};
}

const SVEMIX_KEYWORDS = ['loader', 'action', 'metadata'];

/**
 *
 * @param {string} content
 * @returns {{[key: string]: boolean}}
 */
function checkSvemixKeywords(content) {
	/**
	 *
	 * @param {string} keyword
	 * @returns {boolean}
	 */
	const checkKeyword = (keyword) => {
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
	};

	/**
	 * @type {any}
	 */
	const has = {};

	SVEMIX_KEYWORDS.forEach((keyword) => {
		has[keyword] = checkKeyword(keyword);
	});

	return has;
}

