
  import { getHandler, postHandler } from "$lib/server";

  
	export const metadata = () => ({ title: 'Custom Title' });


  
  export const get = getHandler({
    hasMeta: true,
    loader: () => ({}),
    metadata: metadata
  });
  

  
