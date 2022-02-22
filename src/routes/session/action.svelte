<script context="module" lang="ts" ssr>
	import type { Action } from '$lib';

	export const action: Action = ({ locals }) => {
		let views = locals.session.data?.views || 0;
		views = views + 1;

		locals.session.data = { views };

		return {
			values: {
				views
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
