import { SCRIPTS_REGEX } from './scripts.js';
import transformers from '../transformers/index.js';

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

		if (doc.scripts.dom && script === doc.scripts.dom) {
			// We already have the existing dom module content which will be included inside the ssr transformer
			content = '';
		} else if (script === doc.scripts.ssr) {
			// The ssr transformer handles generating the endpoint and transforms the code with a corresponding load function
			return transformers.ssr({ config, doc });
		} else if (script === doc.scripts.instance) {
			// If we have an instance script add the _metadata field which will be used inside svelte:head.
			return transformers.instance({ config, doc });
		}

		return content;
	});

	doc.content = content;

	// If we have no instance, create one
	if (!doc.scripts.instance?.content) {
		doc.content = `
     ${doc.content}
     ${transformers.instance({ config, doc })}
    `;
	}

	return {
		config,
		doc,
		continue: true
	};
};

export default TransformerPipe;
