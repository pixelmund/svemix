import { tc, SVEMIX_LIB_DIR } from '../utils.js';

/**
 *
 * @param {import('../config').InternalConfig['seo']} defaults
 * @returns {string}
 */
const SvemixMeta = (defaults) => `
  <Meta _defaults={${stringify(defaults)}} {_metadata} />
`;

function stringify(obj_from_json) {
	if (typeof obj_from_json !== 'object' || Array.isArray(obj_from_json)) {
		// not an object, stringify using native function
		return JSON.stringify(obj_from_json);
	}
	// Implements recursive object serialization according to JSON spec
	// but without quotes around the keys.
	let props = Object.keys(obj_from_json)
		.map((key) => `${key}:${stringify(obj_from_json[key])}`)
		.join(',');
	return `{${props}}`;
}

const InstanceTransformer = function (args) {
	let { doc, config } = args;

	const instanceContent = `
    <script ${tc(doc.scripts.instance?.attrs?.lang === 'ts', 'lang="ts"')}>
        import { Meta } from "${SVEMIX_LIB_DIR()}"; 
        ${doc.scripts.instance?.content || ''}
        export let _metadata = {};
    </script>
    ${SvemixMeta(config.seo)}
  `;

	return instanceContent;
};

export default InstanceTransformer;
