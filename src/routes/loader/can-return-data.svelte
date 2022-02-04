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
	export let data: LoaderData;
</script>

<h1>{data.name}</h1>
<h2>{data.age}</h2>
<h3>{data.country}</h3>
