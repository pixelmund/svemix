
  ` and generates the corresponding **SvelteKit** load function for you.
- This enables us to import a database or any other stuff that should never reach the client directly inside you Svelte Routes.

## Basics

Each `.svelte` file inside your `routes` folder can export a `loader` function, this `loader` can return props, redirect or handle errors:

```svelte
<script context="module" lang="ts" ssr>
	import type { Loader } from 'svemix/server';
	import type { Post } from '@prisma/client';
	import db from '$lib/db';

	interface Props {
		posts: Post[];
	}

	export const loader: Loader<Props, Locals> = async function ({}) {
		const posts = await db.post.findMany({ take: 9, orderBy: { createdAt: 'desc' } });
		return {
			props: {
				posts
			}
		};
	};

  

  
  export const get = async function(params){
    //@ts-ignore
    const loaded = await loader(params) 

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
  

  
