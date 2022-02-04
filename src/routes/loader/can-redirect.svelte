<script context="module" ssr lang="ts">
	import { redirect } from '$lib/server';
	export const loader = () => redirect('/loader/redirect-target', 302);
</script>
