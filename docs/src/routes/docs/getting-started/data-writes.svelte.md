---
title: Writing data
---

<script context="module">
	export const prerender = true;
</script>
<script>
	import PostBottomNavigation from "../../../components/PostBottomNavigation.svelte";
</script>

<p class="mb-4 leading-6 font-semibold text-sky-300">Data Writes / Mutations</p>

# {title}

<br>

Mutations are hard, that's why we decided to include some nice helpers and features in SVEMIX which helps you dealing with them in a simple and clean way.
Each Route can define an action function inside the `ssr` context. This action get called by the SVEMIX `Form` Component automatically. The nice thing is they even work with Javascript disabled.

<br>

<h2 id="example">Example</h2>

<br>

Each `.svelte` file inside your `routes` folder can export a `action` function, this `action` can return data, errors, formError, additional headers, status, redirect and it receives the [SvelteKit Request](https://kit.svelte.dev/docs#routing-endpoints):

```svelte
<script context="module" lang="ts" ssr>
	import type { Action } from 'svemix';
	import type { Post } from '@prisma/client';
	import db from '$lib/db';

	interface ActionData {
		title?: string;
		content?: string;
	}

	interface ActionErrors {
		title?: string;
		content?: string;
	}

	export const action: Action<ActionData, Locals> = async function ({ request }) {
		const body = (await request.formData()) as ActionData;

		const title = body.get('title');
		const content = body.get('content');

		if (!title || title.length === 0) {
			return {
				data: {
					title,
					content
				},
				errors: {
					title: 'Title must be greater than 1'
				}
			};
		}

		const newPost = await db.post.create({ data: { title, content } });

		return {
			status: 302,
			redirect: `/posts/${newPost.id}`
		};
	};
</script>

<script>
	import { Form } from 'svemix';
</script>

<Form let:data let:errors let:formError let:loading>
	<input type="text" name="title" />
	<textarea name="content" />

	{#if !loading}
		<button type="submit">Create Post</button>
	{:else}
		Loading...
	{/if}
</Form>
```

<br>

<br>

<h2 id="input">Input</h2>

<br>

The action receives the following input:

```ts
interface SvemixActionInput<Locals = Record<string, any>> {
	request: Request;
	url: URL;
	params: Record<string, string>;
	locals: Locals; // populated by hooks handle
}
```

<br>

<h2 id="output">Output</h2>

<br>

The action can return the following output:

```ts
interface SvemixActionOutput {
	headers?: Record<string, string | string[]>; // Additional Headers
	status?: number;
	redirect?: string;
	errors?: Record<string, string>;
	formError?: string;
	data?: Record<string, any>;
}
```

<PostBottomNavigation
previous={{ title: 'Data Loading', href: '/docs/getting-started/data-loading' }}
next={{ title: 'Meta / SEO', href: '/docs/getting-started/meta'  }}
/>
