import Pipeline from "./pipeline/index.js";

/** @param {import('./').SvemixConfig} config */
export default function SvemixPreprocess(config) {
  /** @type {import('svelte/types/compiler/preprocess').PreprocessorGroup} */
  return {
    /** @type {import('svelte/types/compiler/preprocess').Preprocessor} */
    async markup({ filename, content }) {
      return await Pipeline({
        config,
        doc: {
          filename,
          content,
          scripts: { arr: [] },
          functions: { action: false, loader: false, metadata: false },
          route: {},
        },
      });
    },
  };
}
