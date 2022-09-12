import { posixify } from '../utils/misc.js';

/**
 * @returns {(sourcePath: string, importer: string | undefined, options: { ssr?: boolean | undefined }) => {id: string} | null | void}
 */
export function resolveRoute() {
	return (sourcePath, _importer, { }) => {
		if (!sourcePath.includes('routes')) return;

		if (
			(sourcePath.endsWith('+page.server.ts') || sourcePath.endsWith('+page.server.js') || sourcePath.endsWith('+page.svelte') || sourcePath.includes('+layout'))
		) {
			return {
				id: posixify(sourcePath),
			};
		}

	};
}
