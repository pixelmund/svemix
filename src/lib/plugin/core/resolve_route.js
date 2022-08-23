import { posixify } from '../utils/misc.js';

/**
 * @returns {(sourcePath: string, importer: string | undefined, options: { ssr?: boolean | undefined }) => {id: string} | null}
 */
export function resolveRoute() {
	return (sourcePath, _importer, { }) => {
		if (!sourcePath.includes('routes')) return null;
		const posixified = posixify(sourcePath);

		if (
			(sourcePath.endsWith('+page.server.ts') || sourcePath.endsWith('+page.server.js') || sourcePath.endsWith('+page.svelte'))
		) {
			return {
				id: posixified,
			};
		}

		return null;
	};
}
