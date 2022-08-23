import { SVEMIX_LIB_DIR } from '../utils/index.js';

/**
 * @param {string} source
 * @returns {string}
 */
export function transformRootFile(source) {
    source = source.replace(
        `<script>`,
        `<script>
		import { Meta as SvemixMeta } from "${SVEMIX_LIB_DIR}";`
    );

    source = source.replace(
        `</script>`,
        `</script>
        <SvemixMeta />
        `
    )

    return source;
}