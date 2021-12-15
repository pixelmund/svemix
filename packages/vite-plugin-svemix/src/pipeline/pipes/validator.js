/** @type {import('../types').Pipe} */
export default async function ValidatorPipe(args) {
  let { config, doc } = args;

  config = {
    ...config,
    prerender: false,
    routes: "/routes"
  };

  // Only check for files within routes
  if (!doc.filename || !doc.filename.includes(config.routes)) {
    return {
      config,
      doc,
      continue: false,
    };
  }

  if (!doc.filename.endsWith('.svelte')) {
    return {
      config,
      doc,
      continue: false,
    };
  }

  return {
    config,
    doc,
    continue: true,
  };
}
