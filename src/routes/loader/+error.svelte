<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = ({ error }) => {
		return {
			props: { message: error?.message ?? '' }
		};
	};
</script>

<script lang="ts">
    export let message: string;
</script>

<h1>{message}</h1>
