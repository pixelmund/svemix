import { SVEMIX_DIR, tc, writeFile } from '../utils.js';
const SSRTransformer = function (args) {
	let { doc } = args;
	const ssrContent = ssrEndpointTemplate({
		ssrContent: doc.scripts.ssr.content,
		doc
	});
	writeFile(doc.route.path, ssrContent)
		.then(() => {})
		.catch(console.log);
	const prerenderEnabled = doc.prerender === 'all' || doc.prerender === true;
	return `
  <script context="module">
   ${tc(
			doc.functions.loader || doc.functions.metadata,
			`import { loadHandler } from "${SVEMIX_DIR()}"`
		)}

   ${tc(prerenderEnabled, `export const prerender = true;`)}
   ${tc(!prerenderEnabled, `export const prerender = false;`)}

   ${doc.scripts.dom?.content || ''}

   ${tc(
			doc.functions.loader || doc.functions.metadata,
			`
     export async function load(input) {
      const { params } = input;

      ${tc(!prerenderEnabled, `const queryString = input.url?.search || '';`)}

      let routesName = \`${doc.route.name}\`;
  
      ${tc(
				!prerenderEnabled,
				`
        if(queryString.length > 0){
          routesName = routesName + '?' + queryString;
        }
      `
			)}
      
      const handleLoad = loadHandler({ routesName });

      return handleLoad(input)
     }
     `
		)}
   </script>
  `;
};
export default SSRTransformer;
export const ssrEndpointTemplate = ({ ssrContent, doc }) => {
	let newSSRContent = `
  import * as svemixHandlers from "${SVEMIX_DIR()}/server";

  ${ssrContent}

  ${tc(
		doc.functions.loader || doc.functions.metadata,
		`
  export const get = svemixHandlers.getHandler({
    hasMeta: ${doc.functions.metadata},
    loader: ${doc.functions.loader ? 'loader' : '() => ({})'},
    metadata: ${doc.functions.metadata ? 'metadata' : '() => ({})'}
  });
  `
	)}

  ${tc(
		doc.functions.action,
		`
  export const post = svemixHandlers.postHandler({
    action: action,
  });  
  `
	)}
`;
	return newSSRContent;
};
