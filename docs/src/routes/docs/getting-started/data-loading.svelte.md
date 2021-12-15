---
title: Loading data with svemix
---

<script>
	import PostBottomNavigation from "../../../components/PostBottomNavigation.svelte";
</script>



<p class="mb-4 leading-6 font-semibold text-sky-300">Data Loading</p>

# {title}

<br>

One of the primary features of SVEMIX is simplifying interactions with the server to get data into your Svelte Routes/Components . When you follow these conventions, SVEMIX can automatically:

- Loading Data always happens on the Server, typically the **SvelteKit** `load` function runs on both the client and the server. 
- SVEMIX Vite Plugin replaces all code inside `<script context="module" ssr>` and generates the corresponding **SvelteKit** load function for you.
- This enables us to import a database or any other stuff that should never reach the client directly inside you Svelte Routes.

## Basics

Each `.svelte` file inside your `routes` folder can export a `loader` function, this `loader` can return props, redirect or handle errors:


<PostBottomNavigation
previous={{ title: '', href: '' }}
next={{ title: '', href: ''  }}
/>
