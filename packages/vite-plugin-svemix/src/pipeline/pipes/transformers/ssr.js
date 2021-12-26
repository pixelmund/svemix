import { tc, writeFile } from "../../utils.js";

/** @type {import('./types').Transformer} */
export default function SSRTransformer(args) {
  let { doc, config } = args;

  const ssrContent = ssrEndpointTemplate({
    ssrContent: doc.scripts.ssr.content,
    doc,
  });

  writeFile(doc.route.path, ssrContent)
    .then(() => {})
    .catch(console.log);

  return `
  <script context="module">
   ${tc(doc.functions.loader, `import { loadHandler } from "svemix"`)}

   ${doc.scripts.dom?.content || ""}

   ${tc(
     doc.functions.loader,
     `
     export async function load(input) {
      const { page } = input;

      const queryString = page.query.toString();
  
      let routesName = \`${doc.route.name}\`;
  
      if(queryString.length > 0){
          routesName = routesName + '?' + queryString;
      }
  
      const handleLoad = loadHandler({ routesName });

      return handleLoad(input)
     }
     `
   )}
   </script>
  `;
}

export const ssrEndpointTemplate = ({ ssrContent, doc }) => {
  let newSSRContent = `
  import { getHandler, postHandler } from "svemix/server";

  ${ssrContent}

  ${tc(
    doc.functions.loader,
    `
  export const get = getHandler({
    hasMeta: ${doc.functions.metadata},
    loader: loader,
    metadata: ${doc.functions.metadata ? "metadata" : "() => ({})"}
  });
  `
  )}

  ${tc(
    doc.functions.action,
    `
  export const post = postHandler({
    action: action,
  });  
  `
  )}
`;

  return newSSRContent;
};
