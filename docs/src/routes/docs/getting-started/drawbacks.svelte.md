---
title: Drawbacks
---

<script context="module">
	export const prerender = true;
</script>
<script>
	import PostBottomNavigation from "../../../components/PostBottomNavigation.svelte";
</script>

<p class="mb-4 leading-6 font-semibold text-sky-300">Drawbacks</p>

# {title}

<br>

Svemix has some limitations, the current approach uses a vite plugin which is responsible for generating the corresponding endpoint for you under the svemix folder. This files are still public and can be queries by servers. So you have to make sure to secure your loaders/actions accordingly. For example you should check if the user is logged-in/admin to avoid unwanted people hitting your generated api endpoints. Maybe in the future we can come up with a better solution then creating those endpoints, but we're currently limited by the api `SvelteKit` provides and i can't think of another good solution for this problem.

#### Some other drawbacks which you have to consider if you should use svemix:

- Under the hood we're just using the `SvelteKit` load function which fetches the generated endpoint instead of running directly on the server and returning the Response, instead we make a network request and the response of the endpoint is JSON serialized, which might cause some overhead.
- You currently can't use `relative` imports inside your `ssr module` scripts, `import Foo from "../../foo"` will fail, instead you should use aliases `ìmport Foo from "$lib/foo"`
- The returned props of the `loader` must be JSON serializable e.g.

```svelte
<script context="module" ssr>
    export const loader = () => ({ props: { book: { getYearsSincePublication(){ return new Date() } } } })
</script>
<script>
    export let book;

    // this doesn't exist
    book.getYearsSincePublication()
<script>
```

<br>

<PostBottomNavigation
previous={{ title: 'Sessions', href: '/docs/getting-started/configuration' }}
next={{ title: '', href: '' }}
/>
