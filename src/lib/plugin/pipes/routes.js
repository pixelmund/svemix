import { isAbsolute, resolve } from 'path';
import { SVEMIX_DIR } from '../constants.js';
import { posixify } from '../utils.js';

/**
 * @type {import('./types').Pipe}
 */
const RoutesPipe = async function (args) {
	let { config, doc } = args;

	const ssrScript = doc.scripts.ssr;
	const usesTypescript = ssrScript.attrs && ssrScript.attrs.lang && ssrScript.attrs.lang === 'ts';

	/** @type {string | string[]} */
	let fileName = doc.filename;

	const routes = config.routes;

	if (!isAbsolute(routes)) {
		config.routes = resolve(process.cwd(), routes);
	}

	config.routes = posixify(config.routes);

	fileName = fileName.split('/');
	const extension = fileName.pop();
	fileName = fileName.join('/');
	const svemixFileName = fileName.replace(config.routes, `${SVEMIX_DIR}/routes`);

	const fileToGenerate = `${svemixFileName}/${extension.replace(
		'.svelte',
		usesTypescript ? '.ts' : '.js'
	)}`;

	let routesName = `${fileName.replace(config.routes, '')}/${extension
		.replace('.svelte', '')
		.replace('index', '')}`;

	if (config.trailingSlash) {
		if (!routesName.endsWith('/')) {
			routesName = routesName + '/';
		}
	} else {
		if (routesName.endsWith('/')) {
			routesName = routesName.slice(0, -1);
		}
	}

	const dataName = routesName;

	doc.route = {
		name: routesName,
		path: fileToGenerate,
		data_name: dataName
	};

	return {
		config,
		doc,
		continue: true
	};
};

export default RoutesPipe;
