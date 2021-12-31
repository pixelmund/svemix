import path from "path";
import fs from "fs";
import url from "url";

/** @type {import('./internal').InternalConfig} */
export const defaultConfig = {
  routes: "/routes",
  prerenderAll: false,
  seo: {},
};

export default async function load_config({ cwd = process.cwd() } = {}) {
  const svemix_config_file = path.join(cwd, "svemix.config.js");
  const config_file = fs.existsSync(svemix_config_file)
    ? svemix_config_file
    : null;

  /** @type {import('./internal').InternalConfig} */
  let config;

  if (config_file) {
    config = await import(url.pathToFileURL(config_file).href);

    if (typeof config?.default !== "object") {
      config = defaultConfig;
      return config;
    }

    config = {
      ...defaultConfig,
      ...config.default,
    };
  } else {
    // Default config
    config = defaultConfig;
  }

  return config;
}
