<script context="module" ssr lang="ts">
	import type { Loader } from '$lib';

	export const loader: Loader = () => ({
		status: 404,
		error: new Error('My Custom Error')
	});
</script>

<script lang="ts">
	import { getLoaderData } from '$lib';
	const data = getLoaderData();
</script>