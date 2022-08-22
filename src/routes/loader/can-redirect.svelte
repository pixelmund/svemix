<script context="module" ssr lang="ts">
	import { redirect } from '@sveltejs/kit';
	export const loader = () => {
		throw redirect(307, '/loader/redirect-target');
	};
</script>
