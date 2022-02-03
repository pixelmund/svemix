import { SVEMIX_LIB_DIR } from '../constants.js';
import { SCRIPTS_REGEX } from './scripts.js';

/**
 * @param {import('./types').PipeArgs} args
 */
const Instance_Transformer = (args) => {
	const { doc } = args;

	const instanceContent = `
    <script ${doc.scripts.instance?.attrs?.lang === 'ts' ? 'lang="ts"' : ''}>
		import { setContext as _set_context } from "svelte";
		import { writable as _writable_store } from "svelte/store";
        import { Meta as SvemixMeta } from "${SVEMIX_LIB_DIR}"; 
        ${doc.scripts.instance?.content || ''}
        export let metadata = {};
    </script>
    <SvemixMeta _metadata={metadata} />
  `;

	return instanceContent;
};

/**
 *
 * @type {import('./types').Pipe}
 */
const TransformerPipe = async function (args) {
	let { config, doc } = args;

	const scripts = doc.scripts.arr;
	let scriptsIndex = 0;

	let content = doc.content.replace(SCRIPTS_REGEX, (content, _attrs, _scripts_inner_content) => {
		const script = scripts[scriptsIndex++];

		if (script === doc.scripts.ssr) {
			content = '';
		} else if (script === doc.scripts.instance) {
			// If we have an instance script add the metadata field and Component
			return Instance_Transformer(args);
		}

		return content;
	});

	doc.content = content;

	// If we have no instance, create one
	if (!doc.scripts.instance?.content) {
		doc.content = `
		 ${doc.content}
		 ${Instance_Transformer(args)}
		`;
	}

	return {
		config,
		doc,
		continue: false
	};
};

export default TransformerPipe;
