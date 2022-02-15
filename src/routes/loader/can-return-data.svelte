<script context="module" ssr lang="ts">
	import type { Loader } from '$lib';

	interface LoaderData {
		name: string;
		age: number;
		country: string;
	}

	export const loader: Loader<LoaderData> = () => ({
		name: 'Svemix',
		age: 25,
		country: 'Github'
	});
</script>

<script lang="ts">
	import { getLoaderData } from '$lib';
	const data = getLoaderData<LoaderData>();

	/**
	 *
	 * Or export let data;
	 *
	 */
</script>

<h1>{$data.name}</h1>
<h2>{$data.age}</h2>
<h3>{$data.country}</h3>
