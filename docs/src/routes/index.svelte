<script lang="ts" context="module" ssr>
	import type { Loader } from 'svemix/server';

	export const loader: Loader = async function () {
		return {
			status: 301,
			redirect: '/docs/getting-started/installation'
		};
	};
</script>
