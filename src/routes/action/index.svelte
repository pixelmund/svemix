<script context="module" ssr lang="ts">
	import type { Action } from '$lib';
	import { redirect } from '$lib';

	export const action: Action = async ({ request, locals, setHeaders }) => {
		const body = await request.formData();

		const _action = body.get('_action');

		switch (_action) {
			case '1':
				const val = body.get('val');
				throw redirect(307, '/action/success?val=' + val);
			case '2':
				return {
					errors: {
						val: 'ERROR'
					}
				};
			case '3':
				await new Promise((resolve) => setTimeout(resolve, 2500));
				setHeaders({ 'x-update-me': 'true' });
				return;

			default:
				return;
		}
	};
</script>

<script lang="ts">
	import { Form } from '$lib';
</script>

<Form>
	<input type="hidden" name="val" value="submitter-1" />
	<input type="hidden" name="_action" value="1" />
	<button type="submit" id="submit-1">Submit</button>
</Form>
<Form let:errors>
	<input type="hidden" name="val" value="submitter-2" />
	{#if errors?.val && errors.val.length > 0}
		<p id="error-val-2">{errors.val}</p>
	{/if}
	<input type="hidden" name="_action" value="2" />
	<button type="submit" id="submit-2">Submit</button>
</Form>
<Form let:submitting>
	<input type="hidden" name="_action" value="3" />
	{#if submitting}
		<span id="loader">LOADING...</span>
	{/if}
	<button type="submit" id="submit-4">Submit</button>
</Form>
