import Pipeline from "./pipeline/index.js";

/** @param {import('./').SvemixConfig} config */
export default function SvemixVitePlugin(config) {
  return {
    name: "vite-plugin-svemix",
    enforce: "pre",
    async transform(src, id) {
      const result = await Pipeline({
        config,
        doc: {
          filename: id,
          content: src,
          scripts: { arr: [] },
          functions: { action: false, loader: false, metadata: false },
          route: {},
        },
      });

      return {
        code: result.code,
        map: null,
      };
    },
  };
}
