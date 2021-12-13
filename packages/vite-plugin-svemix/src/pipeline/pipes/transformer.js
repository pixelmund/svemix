import { SCRIPTS_REGEX } from "./scripts.js";
import InstanceTransformer from "./transformers/instance.js";
import SSRTransformer from "./transformers/ssr.js";

const transformers = {
  ssr: SSRTransformer,
  instance: InstanceTransformer,
};

/** @type {import('../types').Pipe} */
export default async function TransformerPipe(args) {
  let { config, doc } = args;

  const scripts = doc.scripts.arr;

  let scriptsIndex = 0;

  let content = doc.content.replace(
    SCRIPTS_REGEX,
    (content, _attrs, _scripts_inner_content) => {
      const script = scripts[scriptsIndex++];

      if (doc.scripts.dom && script === doc.scripts.dom) {
        // We already have the existing dom module content which will be included inside the ssr transformer
        content = "";
      } else if (script === doc.scripts.ssr) {
        // The ssr transformer handles generating the endpoint and transforms the code with a corresponding load function
        return transformers.ssr({ config, doc });
      } else if (script === doc.scripts.instance) {
        // If we have an instance script add the _metadata field which will be used inside svelte:head.
        return transformers.instance({ config, doc });
      }

      return content;
    }
  );

  doc.content = content;

  // If we have to instance, create one
  if (!doc.scripts.instance?.content) {
    doc.content = `
     ${doc.content}
     ${transformers.instance({ config, content: "", doc })}
    `;
  }
  
  return {
    config,
    doc,
    continue: true,
  };
}
