---
title: Loading data
---

<script context="module">
	export const prerender = true;
</script>
<script>
	import PostBottomNavigation from "../../../components/PostBottomNavigation.svelte";
</script>

<p class="mb-4 leading-6 font-semibold text-sky-300">Data Loading</p>

# {title}

<br>

One of the primary features of SVEMIX is simplifying interactions with the server to get data into your Svelte Routes/Components:

- Loading Data always happens on the Server, typically the **SvelteKit** `load` function runs on both the client and the server, this is the equivalent to `getServerSideProps` in Next.
- SVEMIX Vite Plugin replaces all code inside `<script context="module" ssr>` and generates the corresponding **SvelteKit** load function and endpoint under routes/$\_\_svemix\_\_ for you.
- This enables us to import a database or any other stuff that should never reach the client directly inside your Svelte Routes.

<br>

<h2 id="basics">Basics</h2>

<br>

Each `.svelte` file inside your `routes` folder can export a `loader` function, this `loader` can return props, redirect, handle errors, additional headers, status and it receives the [SvelteKit Request](https://kit.svelte.dev/docs#routing-endpoints):

```svelte
<script context="module" lang="ts" ssr>
	import type { Action, Loader } from 'svemix';
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
</script>

<script lang="ts">
	export let posts: Props['posts'] = [];
</script>

<div>
	{JSON.stringify(posts)}
</div>
```

<br>

The loader only runs on the server. That means our hard-coded products array doesn't get included in the browser bundles and it's safe to use server-only for APIs and SDKs for things like database, payment processing, content management systems, etc.

<br>

<h2 id="input">Input</h2>

<br>

The loader receives the following input:

```ts
interface SvemixLoaderInput {
	url: URL;
	method: string;
	params: Record<string, string>;
	headers: Record<string, string>;
	locals: Locals; // populated by hooks handle
}
```

<br>

<h2 id="output">Output</h2>

<br>

The loader can return the following output:

```ts
interface SvemixLoaderOutput {
	headers?: Record<string, string | string[]>; // Additional Headers
	status?: number;
	redirect?: string;
	error?: string | Error;
	maxage?: number;
	props?: Record<string, any>; // Props are getting passed to the component
}
```

<PostBottomNavigation
previous={{ title: 'Installation', href: '/docs/getting-started/installation' }}
next={{ title: 'Data Writes', href: '/docs/getting-started/data-writes'  }}
/>
