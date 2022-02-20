---
title: Metadata / SEO
---

Svemix includes some default meta data / SEO handling, the cool thing is. All you have to do is export a loader function and return a `metadata` property inside your loader. You can also specify default meta tags via the svelte config.

### Example

> Each .svelte file inside your routes folder can export a loader function, this loader can return an object with the metadata property, which svemix makes automatically use of.

```svelte
/// file: src/about.svelte 
<script context="module" lang="ts" ssr>
	import type { Loader } from 'svemix';

	export const loader: Loader = async function (event) {
		return {
			metadata: {
				title: 'About our company',
				description: "I'm a about description"
				// More
			}
		};
	};
</script>
```

### Configuration

You can specify your default meta/seo config inside svelte.config.js

```js
/// file: svelte.config.js
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
};

export default config;
```

### TypeScript

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
