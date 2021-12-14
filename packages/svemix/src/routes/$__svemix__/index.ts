
  
	import type { Loader } from '$lib/server';

	export const loader: Loader = async function () {
		return {
			status: 301,
			redirect: '/docs/getting-started/installation'
		};
	};

  type __Loader_Result = {
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
  }

  
  export const get = async function(params){
    //@ts-ignore
    const loaded = await loader(params) as unknown as __Loader_Result

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
  

  
