import { SVEMIX_LIB_DIR } from '../constants.js';

/**
 * @type {import('./types').Pipe}
 */
const RootPipe = async function (args) {
	let { config, doc } = args;

	if (!doc.filename.endsWith('/generated/root.svelte')) {
		return {
			config,
			continue: true,
			doc
		};
	}

	// We change the root.svelte file to set the action and loader data onto context/stores
	doc.content = doc.content.replace(
		`<script>`,
		`
	<script>
	import { createSvemixContext, updateSvemixContext } from "${SVEMIX_LIB_DIR}/context"`
	);

	const PROPS_REGEX = /export let props/g;
	const propsMatches = doc.content.match(PROPS_REGEX);

	doc.content = doc.content.replace(
		`setContext('__svelte__', stores);`,
		`setContext('__svelte__', stores);

	const svemixStores = createSvemixContext([${propsMatches
		.map((_, index) => `props_${index}`)
		.join(', ')}]);

    $:  {
	   updateSvemixContext(svemixStores, [${propsMatches
				.map((_, index) => `props_${index}`)
				.join(', ')}]);
	}`
	);

	return {
		config,
		continue: false,
		doc
	};
};

export default RootPipe;
