---
title: HTTP Helpers
---

> Svemix provides you with some nice utilities for handling responses.


### redirect

This is a shortcut for sending 30x responses.

```svelte
/// file: src/routes/authenticated-only/index.svelte
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