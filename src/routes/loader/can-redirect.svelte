<script context="module" ssr lang="ts">
	export const loader = () => ({ status: 302, redirect: '/loader/redirect-target' });
</script>
