<script context="module" lang="ts" ssr>
	import type { MetaFn } from '$lib';

	export const loader = () => ({ layout: 'Works!' });
	export const metadata: MetaFn = () => ({ title: 'This should apply to all Children' });
</script>

<script lang="ts">
	export let data: ReturnType<typeof loader>;
</script>

<h1>{data.layout}</h1>
<slot />
