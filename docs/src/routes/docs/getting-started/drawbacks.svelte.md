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

Svemix has some limitations, the current approach uses a vite plugin which is responsible for generating the corresponding endpoint for you. This files are still public and can be queried by anyone. So you have to make sure to secure your loaders/actions accordingly. For example you should check if the user is logged-in/admin to avoid unwanted people hitting your generated api endpoints.

#### Some other drawbacks which you have to consider if you should use svemix:

- The returned data of the `loader` must be JSON serializable e.g. doesn't work:

<br>

```svelte
<script context="module" ssr>
    export const loader = () => (
        {
           book: {
               getYearsSincePublication(){ return new Date() } }
           }
        )
</script>
<script>
    import { getActionData } from "svemix";

    const data = getActionData();

    // this doesn't exist
    $data.book.getYearsSincePublication()
<script>
```

<br>

<PostBottomNavigation
previous={{ title: 'Cookies', href: '/docs/getting-started/cookies' }}
next={{ title: '', href: '' }}
/>
