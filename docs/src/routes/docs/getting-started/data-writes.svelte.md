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
Each Route can define an action function inside the `ssr` context. This action gets called by the SVEMIX `Form` Component which uses a version of the enhance action of **SvelteKit**. The nice thing is they even work with Javascript disabled, and keep all the error states, values etc.

<br>

<h2 id="example">Example</h2>

<br>

Each `.svelte` file inside your `routes` folder can export a `action` function, this `action` can return data, errors, headers, status and it receives the [SvelteKit Request](https://kit.svelte.dev/docs#routing-endpoints):

```svelte
<script context="module" lang="ts" ssr>
	import type { Action } from 'svemix';
	import { redirect } from 'svemix/server';
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

	export const action: Action<ActionData> = async function ({ request }) {
		// @ts-ignore FormData is a little bit weird to type, if someone has an idea how to type it correctly feel free to let me now.
		const body = await request.formData();

		const title = body.get('title');
		const content = body.get('content');

		if (!title || title.length === 0) {
			return {
				values: {
					title,
					content
				},
				errors: {
					title: 'Title must be greater than 1'
				}
			};
		}

		const newPost = await db.post.create({ data: { title, content } });

		return redirect(`/posts/${newPost.id}`, 302);
	};
</script>

<script>
	import { Form } from 'svemix';
</script>

<Form let:values let:errors let:submitting>
	<input type="text" name="title" value={values?.title || ''} />
	<textarea name="content" />

	{#if !submitting}
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
interface SvemixActionInput {
	request: Request;
	url: URL;
	params: Record<string, string>;
	locals: App.Locals;
	platform: App.Platform;
}
```

<br>

<h2 id="output">Output</h2>

<br>

The action can return the following output:

```ts
interface SvemixActionOutput {
	// You can return anything in here but the properties below are special handled.
	values?: Data;
	formError?: string;
	errors?: Err;
	headers?: Record<string, string | string[]>;
	status?: number;
}
```

<PostBottomNavigation
previous={{ title: 'Data Loading', href: '/docs/getting-started/data-loading' }}
next={{ title: 'Meta / SEO', href: '/docs/getting-started/meta'  }}
/>
