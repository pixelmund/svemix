<script context="module" ssr lang="ts">
	export const loader = ({ params }) => {
		return {
			props: {
				id: params.id
			}
		};
	};

	export const action = () => {
		return {
			data: {
				name: 'Harry'
			}
		}
	}
</script>

<script lang="ts">
	import Form from '$lib/Form.svelte';

	export let id: string;
</script>

<h1>{id}</h1>

<Form>
	<input type="text" name="name" />
	<button type="submit">
		Submit
	</button>
</Form>
