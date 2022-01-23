import { isAbsolute, resolve } from 'path';
import type { Pipe } from '../types';
import { posixify } from '../utils.js';

const RoutesPipe: Pipe = async function (args) {
	let { config, doc } = args;

	const ssrScript = doc.scripts.ssr;

	let fileName: string | string[] = doc.filename;

	if (fileName.includes('__layout.svelte')) {
		fileName = fileName.replace('__layout.svelte', '$__layout.svelte');
	}
	if (fileName.includes('__layout.reset.svelte')) {
		fileName = fileName.replace('__layout.reset.svelte', '$__layout_reset.svelte');
	}

	const routes = config.routes;

	if (!isAbsolute(routes)) {
		config.routes = resolve(process.cwd(), routes);
	}

	config.routes = posixify(config.routes);

	fileName = fileName.split('/');
	const extension = fileName.pop();
	fileName = fileName.join('/');

	fileName = fileName.replace(config.routes, `${config.routes}/$__svemix__`);

	const fileToGenerate =
		fileName +
		'/' +
		extension.replace(
			'.svelte',
			ssrScript.attrs && ssrScript.attrs.lang && ssrScript.attrs.lang === 'ts' ? '.ts' : '.js'
		);

	let routesName = `${fileName.replace(config.routes, '')}/${extension
		.replace('.svelte', '')
		.replace('index', '')}`;

	routesName.split('/').forEach((segment) => {
		const param = segment.match(/\[(.*?)\]/);
		if (param && param.length > 0) {
			routesName = routesName.replace(param[0], '${params["' + param[1] + '"]}');
		}
	});

	if (config.trailingSlash) {
		if (!routesName.endsWith('/')) {
			routesName = routesName + '/';
		}
	} else {
		if (routesName.endsWith('/')) {
			routesName = routesName.slice(0, -1);
		}
	}

	doc.route = {
		name: routesName,
		path: fileToGenerate
	};

	return {
		config,
		continue: true,
		doc
	};
};

export default RoutesPipe;
