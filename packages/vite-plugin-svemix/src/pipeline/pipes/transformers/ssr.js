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
   ${doc.scripts.dom?.content || ""}

   ${tc(
     doc.functions.loader,
     `
   export async function load({ fetch, page, session, stuff }) {

    const queryString = ${config.prerender ? `page.query.toString();` : `''`}

    let routesName = \`${doc.route.name}\`;

    if(queryString.length > 0){
        routesName = routesName + '?' + queryString;
    }

    try {
        const response = await fetch(routesName, {
            credentials: 'include',
            headers: { 'content-type': 'application/json' }
        });

        if(!response.ok){
            throw new Error('An unknown error occured');
        }

        const loaded = await response.json();

        return loaded;
    } catch (err) {
        return {
            error: err,
            status: 500
        };
    }
   }
   `
   )}
   </script>
  `;
}

const ssrEndpointTemplate = ({ ssrContent, doc }) => {
  const usesTS = doc.scripts.ssr.attrs?.lang === "ts";

  let newSSRContent = `
  ${ssrContent}
  ${tc(
    usesTS,
    `type __Loader_Result = {
    headers?: Record<string, string | string[]>;
    props?: Record<any, any>;
    error?: string | Error;
    status?: number;
    redirect?: string;
    maxage?: string;
  }

  type __Action_Result = {
    headers?: Record<string, string | string[]>;
    data?: Record<any, any>;
    errors?: Record<string, string>;
    formError?: string;
    redirect?: string;
    status?: number;
  }`
  )}

  ${tc(
    doc.functions.loader,
    `
  export const get = async function(params){
    //@ts-ignore
    const loaded = await loader(params) ${tc(
      usesTS,
      `as unknown as __Loader_Result`
    )}

    if(loaded?.error || loaded?.redirect){
      return {
        headers: loaded?.headers || {},
        body: {  
          props: { _metadata: {} },  
          error: loaded?.error,
          status: loaded?.status,
          redirect: loaded?.redirect,
          maxage: loaded?.maxage    
        }
      }
    }

    let _metadata = {};

    ${tc(
      doc.functions.metadata,
      `
    _metadata = await metadata(loaded?.props ${tc(usesTS, `as unknown as any`)})
   `
    )}

    const loadedProps = loaded?.props || {};
    const metaProps = { _metadata }

    return {
      headers: loaded?.headers || {},
      body: {  
        props: {...loadedProps, ...metaProps},  
        error: loaded?.error,
        status: loaded?.status,
        redirect: loaded?.redirect,
        maxage: loaded?.maxage    
      }
    }
  }
  `
  )}

  ${tc(
    doc.functions.action,
    `
  export const post = async function(params){
    //@ts-ignore
    const loaded = await action(params) ${tc(
      usesTS,
      `as unknown as __Action_Result`
    )}

    // This is a browser fetch
    if(params.headers && params.headers?.accept === 'application/json'){
      return {
        headers: loaded?.headers || {},
        body: {
          redirect: loaded?.redirect,
          formError: loaded?.formError,
          data: loaded?.data,  
          errors: loaded?.errors,
          status: loaded?.status,
        }
      }
    } 

    // This is the default form behaviour, navigate back to form submitter
    if(!loaded?.redirect){
      return {
        headers: {
          ...(loaded?.headers || {}),
          'Location': params.headers?.referer
        },
        status: loaded?.status || 302,
        body: {}
      }
    }

    return {
      headers: {
        ...(loaded?.headers || {}),
        'Location': loaded?.redirect,
      },
      status: loaded?.status || 302,
      body: {}
    }
  }
  `
  )}
`;

  return newSSRContent;
};
