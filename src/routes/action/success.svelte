<script lang="ts">
	import { page } from '$app/stores';
</script>

{#if $page.url.searchParams.get('val')}
	<h1>{$page.url.searchParams.get('val')}</h1>
{/if}
