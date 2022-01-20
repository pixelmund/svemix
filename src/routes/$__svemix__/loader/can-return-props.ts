
  import * as svemixHandlers from "$lib/server";

  
	export const loader = () => ({ props: { name: 'Svemix', age: 25, country: 'Github' } });


  
  export const get = svemixHandlers.getHandler({
    hasMeta: false,
    loader: loader,
    metadata: () => ({})
  });
  

  
