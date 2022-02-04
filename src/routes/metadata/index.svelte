<script context="module" ssr lang="ts">
	import type { Loader } from '$lib';

	export const loader: Loader = () => ({ metadata: { title: 'Custom Title' } });
</script>
