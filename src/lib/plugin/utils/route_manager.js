import { posixify } from './misc.js';
import { getScripts } from './scripts.js';

class RouteManager {
	/**
	 * @type {Map<string, import('../types').SvemixRoute>}
	 */
	#routes = new Map();

	constructor() {}

	/***
	 * @param {import('../types').SvemixRoute} options
	 */
	set(options) {
		this.#routes.set(options.routeId, options);
	}

	/**
	 *
	 * @param {string} routeId
	 * @returns
	 */
	get(routeId) {
		return this.#routes.get(routeId);
	}
    
	all() {
		return Array.from(this.#routes.values());
	}

	/**
	 * @param {string} path
	 */
	parseRouteId(path) {
		return posixify(path).split('src/routes/').pop()?.replace('index.svelte', '+page.svelte');
	}
}

export const routeManager = new RouteManager();

