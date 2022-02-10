---
title: Configuration
---

<script context="module">
	export const prerender = true;
</script>
<script>
	import PostBottomNavigation from "../../../components/PostBottomNavigation.svelte";
</script>

<p class="mb-4 leading-6 font-semibold text-sky-300">HTTP Helpers</p>

# {title}

<br>

Svemix provides you with some response helpers

<br>

<h2 id="example">redirect</h2>

This is a shortcut for sending 30x responses.

<br>

```svelte
<script context="module" lang="ts" ssr>
	import type { Action } from 'svemix';
	import { redirect } from 'svemix/server';

	export const action: Action = async ({ locals }) => {
		const user = locals.session.data.user;

		if (!user) {
			return redirect('/login');
			/**
			  instead of
			  return {
				  status: 302,
				  headers: {
					  location: '/login'
				  }
			  }
			**/
		}

		return {
			ok: true
		};
	};
</script>
```

<br>

<PostBottomNavigation
previous={{ title: 'Configuration', href: '/docs/getting-started/configuration' }}
next={{ title: 'Drawbacks', href: '/docs/getting-started/drawbacks' }}
/>
