class RouteManager {
    /**
     * @type {Map<string, { path: string, isIndex: boolean, content: () => string }>}
     */
    #routes = new Map();

    constructor() { }

    /***
     * @param {{path: string, isIndex: boolean, content: () => string}} options
     */
    set({ path, isIndex, content }) {
        this.#routes.set(path, { path, isIndex, content })
    }

    /**
     * 
     * @param {string} path 
     * @returns 
     */
    get(path) {
        return this.#routes.get(path);
    }

    all() {
        return Array.from(this.#routes.values())
    }
}

export const routeManager = new RouteManager();