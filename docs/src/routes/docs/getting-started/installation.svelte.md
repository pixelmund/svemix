---
title: Getting started with Svemix
---

<script>
	import PostBottomNavigation from "../../../components/PostBottomNavigation.svelte";
</script>

<svelte:head>
	<title> Getting started - SVEMIX </title>
	<meta name="description" content="Getting started with SVEMIX is easy">
</svelte:head>

<p class="mb-4 leading-6 font-semibold text-sky-300">Installation</p>

# {title}

<br>

Welcome to the Svemix docs, the first thing you should so is installing svemix into an existing `@sveltejs/kit` app or create a new one by running `npm init svelte@next <dir>`.

**Kit** set up? Fine now you can start installing svemix by running:

```sh
 npm install svemix
 npm install -D vite-plugin-svemix
```

<br>

Once you have the required dependencies installed, you should add the `vite-plugin-svemix` inside your `svelte.config.js` file under `vite.plugins`

```javascript
import svemix from 'vite-plugin-svemix';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// ...
	kit: {
		// ...
		vite: {
			plugins: [svemix({})]
			/// ...
		}
	}
};

export default config;
```

<PostBottomNavigation
previous={{ title: '', href: '' }}
next={{ title: 'Data Loading', href: '/docs/getting-started/data-loading'  }}
/>
