<script context="module" ssr lang="ts">
	import type { Action } from '$lib';
	import { redirect } from '$lib/server';

	export const action: Action = async ({ request, locals }) => {
		const body = await request.formData();

		const _action = body.get('_action');

		switch (_action) {
			case '1':
				const val = body.get('val');
				return redirect('/action/success?val=' + val, 302);
			case '2':
				const val2 = body.get('val');

				return {
					values: {
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
					values: {
						name,
						year_of_birth
					}
				};
			case '4':
				await new Promise((resolve) => setTimeout(resolve, 2500));

				return {
					headers: {
						'x-update-me': 'true'
					}
				};

			case '5':
				// @ts-ignore
				locals.session.data = { isLoggedIn: true };

				return {};

			default:
				return {};
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
<Form let:data>
	<input type="hidden" name="val" value="submitter-2" />
	{#if data?.errors?.val && data.errors.val.length > 0}
		<p id="error-val-2">{data.errors.val}</p>
	{/if}
	<input type="hidden" name="_action" value="2" />
	<button type="submit" id="submit-2">Submit</button>
</Form>
<Form let:data>
	<input type="text" id="input-name" name="name" value={data?.values?.name || ''} />
	<input
		type="text"
		id="input-birth"
		name="year_of_birth"
		value={data?.values?.year_of_birth || ''}
	/>
	<input type="hidden" name="_action" value="3" />
	<button type="submit" id="submit-3">Submit</button>
</Form>
<Form let:submitting>
	<input type="hidden" name="_action" value="4" />
	{#if submitting}
		<span id="loader">LOADING...</span>
	{/if}
	<button type="submit" id="submit-4">Submit</button>
</Form>
