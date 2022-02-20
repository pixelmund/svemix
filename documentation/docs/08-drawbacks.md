---
title: Drawbacks
---

### Limitations

Svemix has some limitations, the current approach uses a vite plugin which is responsible for generating the corresponding endpoint for you. This files are still public and can be queried by anyone. So you have to make sure to secure your loaders/actions accordingly. For example you should check if the user is logged-in/admin to avoid unwanted people hitting your generated api endpoints.

### Too many files

Since svemix generates endpoints next to your `.svelte` files, this can quickly sum up to a lot of files. There is an open Discussion on the SvelteKit Respository which i'm following for any ways to avoid this. I would really like to have some hidden folder somewhere while enjoying the functionality of shadow-endpoints.

### Other drawbacks

- The returned data of the `loader` must be JSON serializable e.g. doesn't work:

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