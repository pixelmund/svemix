<script context="module" ssr lang="ts">
	import type { Loader } from '$lib';
	import { error } from '$lib';

	export const loader: Loader = () => {
		throw error(404, 'My Custom Error');
	};
</script>

<script lang="ts">
</script>
