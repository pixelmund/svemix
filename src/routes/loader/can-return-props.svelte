<script context="module" ssr lang="ts">
	export const loader = () => ({ props: { name: 'Svemix', age: 25, country: 'Github' } });
</script>

<script lang="ts">
	export let name: string;
	export let age: number;
	export let country: string;
</script>

<h1>{name}</h1>
<h2>{age}</h2>
<h3>{country}</h3>
