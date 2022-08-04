<script context="module" lang="ts" ssr>
	import type { Action } from '$lib';
	import { makeCookie } from '$lib/cookie';

	export const action: Action = ({locals}) => {
		const trackingEnabledCookie = makeCookie('tracking_enabled', '1', {
			path: '/'
		});

		return {
			headers: {
				'set-cookie': [trackingEnabledCookie]
			}
		};
	};
</script>

<script lang="ts">
	import { session } from '$app/stores';
	import { Form } from '$lib';
</script>

<Form>
	<span>
		{$session.views || 0}
	</span>
	<button type="submit">+</button>
</Form>
