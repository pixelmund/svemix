import { SVEMIX_GENERATED_INDEX } from '../utils/constants.js';
import { writeFile, stringifyObject } from '../utils/misc.js';

/**
 *
 * @param {import('../types').InternalConfig} config
 */
export async function initializeSvemix(config) {
	await writeFile(
		SVEMIX_GENERATED_INDEX,
		`export const metaDefaults = ${stringifyObject(config.seo || {})}`
	);
}

