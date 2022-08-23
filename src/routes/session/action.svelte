<script context="module" lang="ts" ssr>
	import type { Action } from '$lib';

	export const action: Action = ({ locals }) => {
		let views = locals.session.data?.views || 0;
		views = views + 1;

		locals.session.data = { views };

		return;
	};
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { Form } from '$lib';
</script>

<Form>
	<span>
		{$page.data.session.views || 0}
	</span>
	<button type="submit">+</button>
</Form>
