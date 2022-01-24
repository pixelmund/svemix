import { SVEMIX_LIB_DIR, tc, writeFile } from '../utils.js';
import prettier from 'prettier';

/**
 *
 * @type {import('./types').Transformer}
 */
const SSRTransformer = function (args) {
	let { doc } = args;

	writeFile(
		doc.route.path,
		prettier.format(doc.scripts.ssr.content, { semi: true, singleQuote: true, parser: 'babel-ts' })
	)
		.then(() => {})
		.catch(console.log);

	const prerenderEnabled = doc.prerender === 'all' || doc.prerender === true;

	return `
  <script context="module">
   ${tc(
			doc.functions.loader || doc.functions.metadata,
			`import { loadHandler } from "${SVEMIX_LIB_DIR()}"`
		)}

   ${tc(prerenderEnabled, `export const prerender = true;`)}
   ${tc(!prerenderEnabled, `export const prerender = false;`)}

   ${doc.scripts.dom?.content || ''}

   ${tc(
			doc.functions.loader || doc.functions.metadata,
			`
     export async function load(input) {
      const { params } = input;

      ${tc(!prerenderEnabled, `const queryString = input.url?.search || '?';`)}

      let routesName = input.url.pathname;
  
      ${
				!prerenderEnabled
					? `
      if(queryString.length > 0){
        routesName = routesName + queryString + '&_data=${encodeURIComponent(doc.route.data_name)}';
      }
      `
					: `
      routesName = routesName + '?_data=${encodeURIComponent(doc.route.data_name)}'
      `
			}

      const handleLoad = loadHandler({ routesName });

      return handleLoad(input)
     }
     `
		)}
   </script>
  `;
};

export default SSRTransformer;
