<script context="module" ssr lang="ts">
	import type { Loader } from '$lib';

	interface LoaderData {
		name: string;
		age: number;
		country: string;
	}

	export const loader: Loader<LoaderData> = () => ({
		data: { name: 'Svemix', age: 25, country: 'Github' }
	});
</script>

<script lang="ts">
	export let loaderData: LoaderData;
</script>

<h1>{loaderData.name}</h1>
<h2>{loaderData.age}</h2>
<h3>{loaderData.country}</h3>
