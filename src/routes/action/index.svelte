<script context="module" ssr lang="ts">
	import type { Action } from '$lib';
	import { redirect } from '$lib/server';

	export const action: Action<any> = async ({ request, locals }) => {
		const body = await request.formData();

		const _action = body.get('_action');

		switch (_action) {
			case '1':
				const val = body.get('val');
				return redirect('/action/success?val=' + val, 302);
			case '2':
				const val2 = body.get('val');

				return {
					data: {
						val: val2
					},
					errors: {
						val: 'ERROR'
					}
				};
			case '3':
				const name = body.get('name');
				const year_of_birth = body.get('year_of_birth');

				return {
					data: {
						name,
						year_of_birth
					}
				};
			case '4':
				await new Promise((resolve) => setTimeout(resolve, 2500));

				return {};

			case '5':
				locals.session.data = { isLoggedIn: true };

				return {};

			default:
				return {};
		}
	};
</script>

<script lang="ts">
	import { Form } from '$lib';
	import type { ActionData } from '$lib/server';

	export let actionData: ActionData;
</script>

<Form {actionData}>
	<input type="hidden" name="val" value="submitter-1" />
	<input type="hidden" name="_action" value="1" />
	<button type="submit" id="submit-1">Submit</button>
</Form>
<Form {actionData} let:errors>
	<input type="hidden" name="val" value="submitter-2" />
	{#if errors.val && errors.val.length > 0}
		<p id="error-val-2">{errors.val}</p>
	{/if}
	<input type="hidden" name="_action" value="2" />
	<button type="submit" id="submit-2">Submit</button>
</Form>
<Form {actionData} let:data>
	<input type="text" id="input-name" name="name" value={data?.name || ''} />
	<input type="text" id="input-birth" name="year_of_birth" value={data?.year_of_birth || ''} />
	<input type="hidden" name="_action" value="3" />
	<button type="submit" id="submit-3">Submit</button>
</Form>
<Form {actionData} let:loading>
	<input type="hidden" name="_action" value="4" />
	{#if loading}
		<span id="loader">LOADING...</span>
	{/if}
	<button type="submit" id="submit-4">Submit</button>
</Form>
