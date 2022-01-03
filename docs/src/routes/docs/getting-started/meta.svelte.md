---
title: Handling meta data / SEO
---

<script context="module">
	export const prerender = true;
</script>
<script>
	import PostBottomNavigation from "../../../components/PostBottomNavigation.svelte";
</script>

<p class="mb-4 leading-6 font-semibold text-sky-300">Metadata / SEO</p>

# {title}

<br>

SVEMIX includes some default meta data / SEO handling, the cool thing is. All you have to do is export an `metadata` function. This `metadata` function receives the returned props of the loader, which means you can dynamically apply titles, descriptions etc. from your loaded data. You can also specify default meta tags via the svelte config.

<br>

<h2 id="example">Example</h2>

<br>

Each `.svelte` file inside your `routes` folder can export a `metadata` function, this `metadata` can return an object with, title, description and so on.

```svelte
<script context="module" lang="ts" ssr>
	import type { Loader, MetaFunction } from 'svemix';
	import type { Post } from '@prisma/client';
	import db from '$lib/db';

	interface Props {
		post: Post;
	}

	export const loader: Loader<Props, Locals> = async function ({ params }) {
		try {
			const post = await db.post.findUnique({
				where: { slug: params.slug },
				rejectOnNotFound: false
			});

			if (!post) {
				return {
					status: 404,
					error: 'Post not found'
				};
			}

			return {
				props: {
					post
				}
			};
		} catch (error) {
			return {
				status: 500,
				error
			};
		}
	};

	export const metadata: MetaFunction<Props> = (props) => ({
		title: props?.post.title,
		description: props?.post?.content
	});
</script>
```

<br>
<br>

<h2 id="configuration">Configuration</h2>

You can specify your default meta/seo config inside `svelte.config.js`

```js
// svelte.config.js

import svemix from 'svemix/plugin';

/** @type {import('svemix').SvemixConfig} */
const config = {
	//...
	svemix: {
		seo: {
			title: '',
			description: '',
			keywords: '',
			openGraph: {
				title: '',
				description: ''
				// etc.
			},
			twitter: {
				site: '',
				title: ''
			}
			// etc.
		}
	},
	// ...
	kit: {
		vite: {
			plugins: [svemix()]
		}
	}
};

export default config;
```

<br>
<br>

<h2 id="input">Input</h2>

<br>

#### The metadata function receives the props you returned within your loader

<br>

<h2 id="output">Output</h2>

<br>

The metadata can return the following output:

```ts
export interface MetaResult {
	title?: string;
	description?: string;
	keywords?: string;
	canonical?: string;
	openGraph?: OpenGraph;
	twitter?: Twitter;
}

export interface OpenGraph {
	title?: string;
	description?: string;
	url?: string;
	type?: string;
	article?: OpenGraphArticle;
	images?: OpenGraphImage[];
}
export interface OpenGraphArticle {
	publishedTime?: string;
	modifiedTime?: string;
	expirationTime?: string;
	section?: string;
	authors?: string[];
	tags?: string[];
}
export interface OpenGraphImage {
	url: string;
	alt?: string;
	width?: number | string;
	height?: number | string;
}
export interface Twitter {
	site?: string;
	title?: string;
	description?: string;
	image?: string;
	imageAlt?: string;
}
```

<PostBottomNavigation
previous={{ title: 'Data Writes', href: '/docs/getting-started/data-writes' }}
next={{ title: 'Sessions', href: '/docs/getting-started/session'  }}
/>
