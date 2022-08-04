---
title: Loading data
---

One of the primary features of svemix is simplifying interactions with the server to get data into your svelte pages/routes, this happens by making use of `SvelteKit's` endpoints.

> Svemix allows you to write your server-side code directly inside your .svelte files which lay under the routes folder. It will then simulate the corresponding [page-endpoint](https://kit.svelte.dev/docs/routing#endpoints) for you.

### Basics

Each `.svelte` file inside your `routes` folder can export a `loader` function, this `loader` can return any data, headers, metadata, status and it receives the [SvelteKit RequestEvent](https://kit.svelte.dev/docs#routing-endpoints):

```svelte
<script context="module" lang="ts" ssr>
	import type { Action, Loader } from 'svemix';
	import type { Post } from '@prisma/client';
	import db from '$lib/db';

	interface LoaderData {
		posts: Post[];
	}

	export const loader: Loader<LoaderData> = async function (event) {
		const posts = await db.post.findMany();

		return {
			posts,
			metadata: {
				title: 'All Posts'
			}
		};
	};
</script>

<script lang="ts">
	export let data: LoaderData;
</script>

/// file: src/routes/posts.svelte
<div>
	{JSON.stringify(data)}
</div>
```

The loader only runs on the server. That means our hard-coded products array doesn't get included in the browser bundles and it's safe to use server-only for APIs and SDKs for things like database, payment processing, content management systems, etc.

### getLoaderData

You can also get the loaderData via the `getLoaderData` function which has to be called within component initialization. It returns an `svelte store` which you can type with generics.

This can be really useful if you have some kind of nested component wich needs access to the loaderData but you don't want to pass the props down multiple times:

```svelte
/// file: src/routes/user/[username].svelte
<script context="module" ssr>
	import { loadUserSomeHow } from "$lib";

	export const loader = async ({ params }) => {
		const user = await loadUserSomeHow(params.username);

		return {
			user
		}
	}
</script>
<script>
	import User from "$lib/User.svelte";

	/**
	  data contains the user object
	**/
	export let data;
</script>

<User />
```
```svelte
/// file: src/lib/User.svelte
<script>
	import { getLoaderData } from "svemix";

	const data = getLoaderData();
</script>

<div>
	<p>Username: {$data?.user.username}</p>
</div>
```

### Input

The loader receives the SvelteKit RequestEvent. Always refer to the [SvelteKit docs](https://kit.svelte.dev/docs/routing) to learn about how to handle params, searchParams, request, locals etc.. Since svemix makes heavy usage of SvelteKit nearly everything is identical.

### Output

```ts
// @filename: meta.d.ts

interface OpenGraph {
	title?: string;
	description?: string;
	url?: string;
	type?: string;
	article?: OpenGraphArticle;
	images?: OpenGraphImage[];
}
interface OpenGraphArticle {
	publishedTime?: string;
	modifiedTime?: string;
	expirationTime?: string;
	section?: string;
	authors?: string[];
	tags?: string[];
}
interface OpenGraphImage {
	url: string;
	alt?: string;
	width?: number | string;
	height?: number | string;
}
interface Twitter {
	site?: string;
	title?: string;
	description?: string;
	image?: string;
	imageAlt?: string;
}
interface MetaData {
	title?: string;
	description?: string;
	keywords?: string;
	canonical?: string;
	openGraph?: OpenGraph;
	twitter?: Twitter;
}

// @filename: index.ts
// ---cut---
// @errors: 2304
export type LoaderResult<Data extends Record<string, any> = Record<string, any>> = Data & {
	headers?: Record<string, string | string[]>;
	metadata?: MetaData;
	status?: number;
};
export type Loader<Pr extends Record<any, any> = Record<any, any>> = (
	request: RequestEvent
) => MaybePromise<LoaderResult<Pr>>;

```