import prettier from 'prettier';
import { SVEMIX_LIB_DIR } from '../constants.js';
import { writeFile } from '../utils.js';

/**
 * @type {import('./types').Pipe}
 */
const GeneratorPipe = async function (args) {
	let { config, doc } = args;

	const ssrScript = doc.scripts.ssr;
	const usesTypescript = ssrScript.attrs && ssrScript.attrs.lang && ssrScript.attrs.lang === 'ts';

	const fileToGenerate = doc.filename.replace('.svelte', usesTypescript ? '.ts' : '.js');

	const endpointContent = prettier.format(
		SHADOW_ENDPOINT_TEMPLATE({
			content: ssrScript.content,
			functions: doc.functions
		}),
		{ semi: true, singleQuote: true, parser: 'babel-ts' }
	);

	await writeFile(fileToGenerate, endpointContent);

	return {
		config,
		continue: true,
		doc
	};
};

/**
 * @param {{ content: string, functions: { loader: boolean; action: boolean; } }} props
 * @returns {string}
 */
const SHADOW_ENDPOINT_TEMPLATE = (props) => `
import { get as __get, post as __post } from "${SVEMIX_LIB_DIR}/server";

${props.content}
${
	props.functions.loader
		? `export const get = __get(loader);`
		: `export const get = __get(() => ({}))`
}
${props.functions.action ? `export const post = __post(action);` : ''}
`;

export default GeneratorPipe;
