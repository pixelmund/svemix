---
title: Writing data
---

Data writes / Mutations are hard, that’s why we decided to include some nice helpers and features in Svemix which helps you dealing with them in a simple and clean way. Each Route can define an action function inside the ssr context. On submit the action gets called by the Svemix `Form Component` and svemix automatically invalidates all the data/props for your current page. The nice thing is they even work with Javascript disabled, and keep all the error states, values etc.

### Example

Each `.svelte` file inside your routes folder can export an `action` function, this `action` can return any data you like, headers, status and it receives the [SvelteKit RequestEvent](https://kit.svelte.dev/docs#routing-endpoints):

```svelte
/// file: src/routes/posts/new.svelte 
<script context="module" lang="ts" ssr>
	import type { Action } from 'svemix';
	import { redirect } from 'svemix/server';
	import type { Post } from '@prisma/client';
	import db from '$lib/db';

	export const action: Action = async function ({ request }) {
		const body = await request.formData();

		const title = body.get('title') as string;
		const content = body.get('content') as string;

		if (!title || title.length === 0) {
			return {
				values: {
					title,
					content
				},
				errors: {
					title: 'A post title is required'
				}
			};
		}

		const newPost = await db.post.create({ data: { title, content } });

		return redirect(`/posts/${newPost.id}`, 302);
	};
</script>

<script lang="ts">
	import { Form } from 'svemix';

	function validateOnClient(formData: FormData) {
		const title = formData.get('title') as string;

		const errors: any = {};

		if (!title || title.length === 0) {
			errors.title = 'A post title is required';
		}

		return errors;
	}
</script>

<Form let:data let:submitting validate={validateOnClient}>
	<input type="text" name="title" value={data?.values?.title || ''} />
	<textarea name="content">{data?.values?.content || ''}</textarea>

	{#if !submitting}
		<button type="submit">Create Post</button>
	{:else}
		Loading...
	{/if}
</Form>
```

### getActionData

You can also get the actionData via the `getActionData` function which has to be called within component initialization. It returns an `svelte store` which you can type with generics.

This can be really useful if you have some kind of input component:

```svelte
/// file: src/lib/Input.svelte
<script>
	import { getActionData } from 'svemix';

	export let name;
	export let id = name;
	export let label = '';
	export let type = 'text';

	const actionData = getActionData();
	$: value = $actionData?.values?.[name] || '';
	$: error = $actionData?.errors?.[name] || '';
</script>

<label>
	{label}
	<input {name} {id} {value} {type} />
	{#if error && error.length > 0}
		<span class="error" aria-describedby={id} aria-invalid="true" />
	{/if}
</label>
```

### Input

The action receives the SvelteKit RequestEvent. Always refer to the [SvelteKit docs](https://kit.svelte.dev/docs/routing) to learn about how to handle params, searchParams, request, formData, locals etc.. Since svemix makes heavy usage of SvelteKit nearly everything is identical.

### Output

```ts
type ActionOutput = {
	headers?: Headers | Record<string, string | string[]>;
	status?: number;
	[key: string]: any;
};
```