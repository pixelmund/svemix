class RouteManager {
    /**
     * @type {Map<string, { path: string, isIndex: boolean, content: string }>}
     */
    #routes = new Map();
    #directories = new Set();

    constructor() { }

    /***
     * @param {{path: string, isIndex: boolean, content: string}} options
     */
    set({ path, isIndex, content }) {
        this.#routes.set(path, { path, isIndex, content })
    }

    virtualDirectories() {
        return Array.from(this.#directories.values())
    }

    /**
     * 
     * @param {string} path 
     */
    isVirtualDirectory(path) {
        this.#directories.has(path);
    }

    /**
     * 
     * @param {string} path 
     */
    addVirtualDirectory(path) {
        this.#directories.add(path);
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