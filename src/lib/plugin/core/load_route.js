import fs from 'fs';
import { getScripts, SVEMIX_LIB_DIR } from '../utils/index.js';

/**
 *
 * @returns {(id: string) => {code: string} | null}
 */
export function loadRoute() {
	return (id) => {
		if (!id.includes('routes')) return null;
		if (id.includes('.svelte')) return null;
		if (id.includes('.json')) return null;

		const source = id;
		const svelteSourceFile = source.replace('.ts', '.svelte').replace('.js', '.svelte');
		const svelteSource = fs.readFileSync(svelteSourceFile, { encoding: 'utf-8' });

		const scripts = getScripts(svelteSource);
		const ssrScript = scripts.find(
			(script) => script.attrs?.context === 'module' && script.attrs?.ssr
		);

		if (!ssrScript) return { code: '' };

		const ssrContent = ssrScript.content;

		const hasLoader = checkForSvemixKeyword('loader', ssrContent);
		const hasAction = checkForSvemixKeyword('action', ssrContent);

		return {
			code: `
			import { get as __get, post as __post } from '${SVEMIX_LIB_DIR}/server';
			${ssrScript.content}
			${hasLoader ? 'export const GET = __get(loader);' : ''}
			${hasAction ? 'export const POST = __post(action);' : ''}
			`
		};
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

