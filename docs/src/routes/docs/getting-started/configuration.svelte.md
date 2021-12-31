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

You can provide svemix a `svemix.config.js` file inside your project root. This config file should export default a svemix config object. The configuration will be used by vite-plugin-svelte for seo and other details.

### Please note: the config is pretty much still todo, there are only a few seo defaults right now. We will also make the routes/output folder configurable in the future.

<br>

<h2 id="example">Example</h2>

<br>

```js
// svemix.config.js
import svemix from 'vite-plugin-svemix';

/** @type {import('vite-plugin-svemix').SvemixConfig} */
const config = {
  prerenderAll: false, // boolean
  seo: {
    title: "",
    description: "",
    keywords: "",
  };
};

export default config;
```

<PostBottomNavigation
previous={{ title: 'Sessions', href: '/docs/getting-started/session' }}
next={{ title: '', href: '' }}
/>
