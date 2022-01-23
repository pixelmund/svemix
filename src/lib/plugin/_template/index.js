import { SVEMIX_LIB_DIR } from "../utils.js";

export const TEMPLATE = () => `
import { serverHandler, get_parts, get_pattern } from '${SVEMIX_LIB_DIR()}/server';

/**
 * @type {import('${SVEMIX_LIB_DIR()}/server').SvemixRoutes}
 */
 // @ts-ignore
 let routes = import.meta.globEager('./routes/**/*');
 
 // @ts-ignore
 routes = Object.entries(routes).map(([key, value]) => {
	let fileName = key.replace('/index', '').replace('/routes', '').split('.').slice(0, -1).join('');
	fileName = fileName.substring(1, fileName.length);
	const parts = get_parts(fileName, key);

	/**
	 * @type {any[]}
	 */
	const params = [];
	params.push(parts.filter((p) => p.dynamic).map((p) => p.content));

	return { handler: value, pattern: get_pattern([parts], false), params: params && params[0].length > 0 ? get_params(params[0]) : undefined };
});

export const svemixHandler = () => serverHandler({ routes });

`;
