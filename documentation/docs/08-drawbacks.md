---
title: Drawbacks
---

### Limitations

Svemix has some limitations, the current approach uses a vite plugin which is responsible for simulating the corresponding endpoint for you. This files are still public and can be queried by anyone. So you have to make sure to secure your loaders/actions accordingly. For example you should check if the user is logged-in/admin to avoid unwanted people hitting your endpoints.

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