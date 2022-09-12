// @ts-nocheck
import filesystem, { Dirent } from 'fs';
import { join as pathJoin } from 'path';
import { routeManager } from './route_manager.js';
import { getScripts } from './scripts.js';

const _readDirSync = filesystem.readdirSync;
const _statSync = filesystem.statSync;
const _readFileSync = filesystem.readFileSync;

filesystem.statSync = function (path, options) {
	if (!path.includes('routes')) return _statSync(path, options);
	if (
		!path.endsWith('.svelte') &&
		!path.includes('+page.server') &&
		!path.includes('+layout.server')
	) {
		return {
			isDirectory: () => true
		};
	}

	try {
		const result = _statSync(path, options);
		return result;
	} catch (error) {
		return {
			isDirectory: () => false
		};
	}
};

filesystem.readFileSync = function (path, options) {
	try {
		return _readFileSync(path, options);
	} catch (error) {
		const route = routeManager.get(routeManager.parseRouteId(path));

		if (!route) {
			return '';
		}

		return route.serverScript().content;
	}
};

/**
 * @param {{ routeId: string; filePath: string; isIndex: boolean; isLayout: boolean }} options
 * @returns {import('../types').SvemixRoute}
 */
const createRoute = (options) => {
	return {
		routeId: options.routeId,
		isIndex: options.isIndex,
		isLayout: options.isLayout,
		content: () => _readFileSync(options.filePath, 'utf8'),
		serverScript: () => {
			const content = _readFileSync(options.filePath, 'utf8');
			if (!content) return { available: false, lang: 'js', content: '' };

			const scripts = getScripts(content);
			const ssrScript = scripts.find(
				(script) => script.attrs?.context === 'module' && script.attrs?.ssr
			);

			if (!ssrScript) return { available: false, lang: 'js', content: '' };

			return {
				available: true,
				content: ssrScript.content,
				lang: ssrScript?.attrs?.lang ?? 'js'
			};
		}
	};
};

filesystem.readdirSync = function (path, options) {
	if (!path.includes('routes')) return _readDirSync(path, options);
	if (path.endsWith('.d.ts')) return [];
	if (path.includes('/types/')) return [];

	function getFileName(file) {
		if (file instanceof Dirent) {
			return file.name;
		} else if (typeof file === 'string') {
			return file;
		} else {
			return '';
		}
	}

	/**
	 * @param {string} name
	 * @param {string} type
	 */
	function getFile(name, type = 'file') {
		if (options?.withFileTypes) {
			/**
			 * @type {Dirent}
			 */
			const dirent = {
				name,
				isFile: () => type === 'file',
				isDirectory: () => type === 'directory',
				isBlockDevice: () => false,
				isFIFO: () => false,
				isCharacterDevice: () => false,
				isSocket: () => false,
				isSymbolicLink: () => false
			};

			return dirent;
		} else {
			return name;
		}
	}

	/**
	 * @type {unknown[]}
	 */
	let result = [];
	try {
		result = _readDirSync(path, options);
	} catch (error) {
		let routeId = routeManager.parseRouteId(path);

		/**
		 * @type {import('../types').SvemixRoute}
		 */
		const route = createRoute({
			filePath: pathJoin(path + '.svelte'),
			routeId: routeId + '/+page.svelte',
			isIndex: false,
			isLayout: false
		});

		let content = route.content();

		if (typeof content !== 'string') {
			throw error;
		}

		routeManager.set(route);

		const { available, lang } = route.serverScript();

		if (!available) {
			return [getFile('+page.svelte')];
		}

		routeManager.set({
			...route,
			routeId: `${routeId}/+page.server.${lang}`
		});

		return [getFile(`+page.svelte`), getFile(`+page.server.${lang}`)];
	}

	const ignuredEntries = [
		'+error.svelte',
		'+page.svelte',
		'+page.server.ts',
		'+page.server.js',
		'+layout.js',
		'+layout.ts'
	];

	const newResult = [
		...new Set(
			result
				.map((_entry) => {
					let entry = getFileName(_entry);

					const joinedPath = pathJoin(path, entry);
					if (ignuredEntries.includes(entry) || !entry.endsWith('.svelte')) return [_entry];

					const routeId = routeManager.parseRouteId(joinedPath);

					/// Layouts
					if (entry.includes('+layout')) {
						const layoutRoute = createRoute({
							filePath: joinedPath,
							routeId,
							isIndex: false,
							isLayout: true
						});
						routeManager.set(layoutRoute);

						const { available, lang } = layoutRoute.serverScript();

						if (available) {
							routeManager.set({
								...layoutRoute,
								routeId: routeId.replace(entry, `+layout.server.${lang}`)
							});
							return [_entry, getFile(`+layout.server.${lang}`)];
						}

						return [_entry];
					}

					if (!routeId.endsWith('+page.svelte')) {
						return [getFile(entry.replace('.svelte', ''), 'directory')];
					}

					const route = createRoute({
						routeId,
						isIndex: entry.endsWith('index.svelte'),
						isLayout: false,
						filePath: joinedPath
					});

					routeManager.set(route);

					const { available, lang } = route.serverScript();

					if (available) {
						routeManager.set({
							...route,
							routeId: routeId.replace('+page.svelte', `+page.server.${lang}`)
						});
						return [getFile(`+page.svelte`), getFile(`+page.server.${lang}`)];
					}

					return [getFile('+page.svelte')];
				})
				.flat()
		)
	];

	return newResult;
};

Object.defineProperty(globalThis, 'fs', {
	configurable: true,
	enumerable: true,
	value: filesystem
});
