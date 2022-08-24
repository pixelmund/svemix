// @ts-nocheck
import filesystem from 'fs';
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
		if (error.message.includes('src/routes')) {
			return '';
		}
		throw error;
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

	/**
	 * @type {string[]}
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
			return ['+page.svelte'];
		}

		routeManager.set({
			...route,
			routeId: `${routeId}/+page.server.${lang}`
		});

		return [`+page.svelte`, `+page.server.${lang}`];
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
				.map((entry) => {
					const joinedPath = pathJoin(path, entry);
					if (ignuredEntries.includes(entry) || !entry.endsWith('.svelte')) return [entry];

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
							return [entry, `+layout.server.${lang}`];
						}

						return [entry];
					}

					if (!routeId.endsWith('+page.svelte')) {
						return [entry.replace('.svelte', '')];
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
						return [`+page.svelte`, `+page.server.${lang}`];
					}

					return ['+page.svelte'];
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

