import path from 'path';

/**
 *
 * @returns {(sourcePath: string, importer: string | undefined, options: { ssr?: boolean | undefined }) => {id: string} | null}
 */
export function resolveRoute() {
	return (sourcePath, _importer, { ssr }) => {
		if (!ssr) return null;

		if (
			sourcePath.includes('routes') &&
			(sourcePath.endsWith('.ts') || sourcePath.endsWith('.js')) &&
			!sourcePath.includes('.json.')
		) {
			return {
				id: path.relative(process.cwd(), sourcePath)
			};
		}

		return null;
	};
}

