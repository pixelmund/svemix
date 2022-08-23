class RouteManager {
    /**
     * @type {Map<string, { path: string, isIndex: boolean, isLayout: boolean; content: () => string }>}
     */
    #routes = new Map();

    constructor() { }

    /***
     * @param {{path: string, isIndex: boolean, isLayout: boolean; content: () => string}} options
     */
    set({ path, isIndex, content, isLayout }) {
        this.#routes.set(path, { path, isIndex, content, isLayout })
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