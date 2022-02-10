---
title: Configuration
---

<script context="module">
	export const prerender = true;
</script>
<script>
	import PostBottomNavigation from "../../../components/PostBottomNavigation.svelte";
</script>

<p class="mb-4 leading-6 font-semibold text-sky-300">Configuration</p>

# {title}

<br>

You can provide svemix an object inside your `svelte.config.js` file, which will be used for seo defaults and other stuff in the future.

<br>

<h2 id="example">Example</h2>

<br>

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

<PostBottomNavigation
previous={{ title: 'Sessions', href: '/docs/getting-started/session' }}
next={{ title: 'HTTP Helpers', href: '/docs/getting-started/http-helpers' }}
/>
