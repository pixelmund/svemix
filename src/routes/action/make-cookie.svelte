<script context="module" lang="ts" ssr>
	import type { Loader } from '$lib';
	import { makeCookie } from '$lib/cookie';

	export const loader: Loader = ({ setHeaders }) => {
		const trackingEnabledCookie = makeCookie('tracking_enabled', '1', {
			path: '/'
		});

		setHeaders({ 'set-cookie': [trackingEnabledCookie] });
		return {};
	};
</script>

<script lang="ts">
</script>
