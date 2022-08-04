import { SVEMIX_LIB_DIR } from '../utils/index.js';

/**
 * @param {string} source
 * @returns {string}
 */
export function transformRootFile(source) {
	source = source.replace(
		`<script>`,
		`
        <script>
		import { createSvemixContext, updateSvemixContext } from "${SVEMIX_LIB_DIR}/context"`
	);

	const PROPS_REGEX = /export let props/g;
	const propsMatches = source.match(PROPS_REGEX);

	if (propsMatches) {
		source = source.replace(
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
	}

	return source;
}

