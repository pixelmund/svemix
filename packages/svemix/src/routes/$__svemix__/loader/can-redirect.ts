
  import { getHandler, postHandler } from "$lib/server";

  
	export const loader = () => ({ status: 302, redirect: '/loader/redirect-target' });


  
  export const get = getHandler({
    hasMeta: false,
    loader: loader,
    metadata: () => ({})
  });
  

  
