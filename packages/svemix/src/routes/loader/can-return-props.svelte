<script context="module" ssr lang="ts">
	export const loader = () => ({ props: { name: 'Svemix', age: 25, country: 'Github' } });
</script>

<script>
	export let name;
	export let age;
	export let country;
</script>

<h1>{name}</h1>
<h2>{age}</h2>
<h3>{country}</h3>
