# Welcome to Svemix

This "framework" is built on top of `@sveltejs/kit`, it aims to provide more `full-stack` features and reduce boilerplate / overhead, much of the apis are similar to `remix.run`.

## Features

- [x] Server-Only Load Functions
- [x] Remix-Like Loader Functions which run only on the Server (SvelteKit Equivalent to getServerSideProps).
- [x] Easy Meta Tags / SEO Handling
- [x] Session Management, refer to [https://github.com/pixelmund/svelte-kit-cookie-session](svelte-kit-cookie-session)
- [ ] Easy Form Handling (Partially available, with actions)

[For an full but still early example please look into this repo](https://github.com/pixelmund/svemix-example).

### Getting Started

```sh
 npm install svemix
 npm install -D vite-plugin-svemix
```

```js
/// svelte.config.js
...
import svemix from 'vite-plugin-svemix';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// ...
	kit: {
		// ...
		vite: {
			plugins: [svemix({})],
			/// ...
		}
	}
};

export default config;

```

### Under the hood

The vite plugin currently looks for your .svelte files inside `routes`, we're then generating an `src/routes/$__svemix__` folder which contains all corresponding function for your `loader` and `action`. Every .svelte file that includes a `<script context="module" ssr>` will result in a corresponding generated endpoint and all the code executes only on the server. Take a look at the generated code, to get a feeling about whats happening. For each loader the plugin, defines the `load` function for you and is perfectly trimmed to work with the response. This is the true equivalent to `getServerSideProps` in `Next.JS`

### Examples

Loader function, with dynamic meta tags

`src/routes/users/[username].svelte`

```svelte

<script context="module" lang="ts" ssr>
	import db from '$lib/db';
	import type { User } from '@prisma/client';
	import type { Loader } from 'svemix';
	interface LoaderData {
		user: Pick<User, 'id' | 'username' | 'email'>;
	}
	export const loader: Loader<LoaderData, Locals> = async function ({ params }) {
		const user = await db.user.findUnique({
			where: { username: params.username },
			select: { id: true, email: true, username: true }
		});
		return {
			props: {
				user
			}
		};
	};
	export const metadata = ({ user }) => ({
		title: user?.username ?? 'Default Title',
		description: 'This is a user'
	});
</script>

<script lang="ts">
	export let user: LoaderData['user'];
</script>

<h1 class="text-4xl text-center mt-8">{user?.username}</h1>

```

### There are a lot of things missing in this README, i will try to get some docs out soon!
