
  import { getHandler, postHandler } from "svemix/server";

  
	import type { Loader } from 'svemix/server';

	export const loader: Loader = async function () {
		return {
			status: 301,
			redirect: '/docs/getting-started/installation'
		};
	};


  
  export const get = getHandler({
    hasMeta: false,
    loader: loader,
    metadata: () => ({})
  });
  

  
