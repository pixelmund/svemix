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

- Loading Data always happens on the Server
- SVEMIX Vite Plugin replaces all code inside `<script context="module" ssr>` and generates the corresponding **SvelteKit** endpoint next to the file for you, this means for `src/routes/todos.svelte` it will generate `src/routes/todos.{js|ts}`. **SvelteKit** will then make sure to run your loader on the server and for client side navigations it fetches the data required by the page.
- This enables us to import a database or any other stuff that should never reach the client directly inside your Svelte Routes.

<br>

<h2 id="basics">Basics</h2>

<br>

Each `.svelte` file inside your `routes` folder can export a `loader` function, this `loader` can return data, headers, metadata, status and it receives the [SvelteKit RequestEvent](https://kit.svelte.dev/docs#routing-endpoints):

```svelte
<script context="module" lang="ts" ssr>
	import type { Action, Loader } from 'svemix';
	import type { Post } from '@prisma/client';
	import db from '$lib/db';

	interface LoaderData {
		posts: Post[];
	}

	export const loader: Loader<LoaderData> = async function ({ request, locals }) {
		const posts = await db.post.findMany({ take: 9, orderBy: { createdAt: 'desc' } });
		return {
			data: {
				posts
			},
			metadata: {
				title: 'All Posts'
			}
		};
	};
</script>

<script lang="ts">
	export let data: LoaderData;
</script>

<div>
	{JSON.stringify(data)}
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
	request: Request;
	url: URL;
	params: Record<string, string>;
	locals: App.Locals;
	platform: App.Platform;
}
```

<br>

<h2 id="output">Output</h2>

<br>

The loader can return the following output:

```ts
interface SvemixLoaderResult<Data extends Record<any, any> = Record<any, any>> {
	status?: number;
	headers?: Record<string, string | string[]>;
	data?: Data;
	metadata?: MetaData;
}
type SvemixLoaderOutput<Data extends Record<any, any> = Record<any, any>> = LoaderResult<Data>;
```

<PostBottomNavigation
previous={{ title: 'Installation', href: '/docs/getting-started/installation' }}
next={{ title: 'Data Writes', href: '/docs/getting-started/data-writes'  }}
/>
