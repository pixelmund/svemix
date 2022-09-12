/**
 *
 * @returns {string}
 */
export function patchNavigationFile() {
	return `
import { client } from '../client/singletons.js';

/**
 * @param {string} name
 */
function guard(name) {
	return () => {
		throw new Error(\`Cannot call \${name}(...) on the server\`);
	};
}

/**
 * @param {string} name
 */
function callee(name){
	return (...args) => client[name].call(this, ...args);
}

const ssr = import.meta.env.SSR;

export const disableScrollHandling = ssr
	? guard('disableScrollHandling')
	: callee('disable_scroll_handling');
export const goto = ssr ? guard('goto') : callee('goto');
export const invalidate = ssr ? guard('invalidate') : callee('invalidate');
export const prefetch = ssr ? guard('prefetch') : callee('prefetch');
export const prefetchRoutes = ssr ? guard('prefetchRoutes') : callee('prefetchRoutes');
export const beforeNavigate = ssr ? () => {} : callee('before_navigate');
export const afterNavigate = ssr ? () => {} : callee('after_navigate');
`;
}
