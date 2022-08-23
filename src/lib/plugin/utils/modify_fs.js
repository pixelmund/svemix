// @ts-nocheck
import filesystem from 'fs';
import { join as pathJoin } from "path";
import { posixify } from './misc.js';
import { routeManager } from './route_manager.js';
import { getScripts } from './scripts.js';

const _readDirSync = filesystem.readdirSync;
const _statSync = filesystem.statSync;
const _readFileSync = filesystem.readFileSync;

filesystem.statSync = function (path, options) {
	if (!path.includes('routes')) return _statSync(path, options);
	if (!path.endsWith('.svelte') && !path.includes('+page.server')) {
		return {
			isDirectory: () => true
		}
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
}

filesystem.readdirSync = function (path, options) {
	if (!path.includes('routes')) return _readDirSync(path, options);
	/**
	 * @type {string[]}
	 */
	let result = [];
	try {
		result = _readDirSync(path, options);
	} catch (error) {
		let routePath = posixify(path).split('src/routes/').pop();

		const route = {
			path: routePath + '/+page.svelte',
			isIndex: false,
			content: () => _readFileSync(pathJoin(path + '.svelte'), 'utf8')
		};

		let content = route.content();

		if (typeof content !== 'string') {
			throw error;
		}

		const scripts = getScripts(content);
		const ssrScript = scripts.find((s) => s.attrs?.context === 'module' && s.attrs?.ssr)

		routeManager.set(route);

		if (!ssrScript) {
			return ["+page.svelte"];
		}

		routeManager.set({ ...route, path: `${routePath}/+page.server.${ssrScript.attrs?.lang === 'ts' ? 'ts' : 'js'}` });

		return [`+page.svelte`, `+page.server.${ssrScript.attrs?.lang === 'ts' ? 'ts' : 'js'}`]
	}

	const ignuredEntries = ['+layout.svelte', '+error.svelte', '+page.svelte', '+page.server.ts', '+page.server.js',]

	const newResult = [
		...new Set(
			result
				.map((entry) => {
					const joinedPath = pathJoin(path, entry);
					if (ignuredEntries.includes(entry) || !entry.endsWith('.svelte')) return [entry];

					let routePath = posixify(joinedPath).split('src/routes/').pop().replace('index.svelte', '+page.svelte');

					if (!routePath.endsWith('+page.svelte')) {
						return [entry.replace('.svelte', '')]
					}

					const route = {
						path: routePath,
						isIndex: entry.endsWith('index.svelte'),
						content: () => _readFileSync(joinedPath, 'utf8')
					};

					routeManager.set(route)

					let content = route.content();

					if (typeof content === 'string') {
						const scripts = getScripts(content);
						const ssrScript = scripts.find((s) => s.attrs?.context === 'module' && s.attrs?.ssr)
						if (ssrScript) {
							routeManager.set({ ...route, path: routePath.replace('+page.svelte', `+page.server.${ssrScript.attrs?.lang === 'ts' ? 'ts' : 'js'}`) });
							return [`+page.svelte`, `+page.server.${ssrScript.attrs?.lang === 'ts' ? 'ts' : 'js'}`]
						};
					}

					return ['+page.svelte']

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

