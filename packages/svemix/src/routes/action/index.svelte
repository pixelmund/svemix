<script context="module" ssr lang="ts">
	import type { Action } from '$lib';

	export const action: Action<any, Locals> = async ({ body, locals }) => {
		const _action = body.get('_action');

		switch (_action) {
			case '1':
				const val = body.get('val');
				return {
					status: 302,
					redirect: '/action/success?val=' + val
				};
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

<script>
	import { session } from '$app/stores';
	import { Form } from '$lib';
</script>

<Form>
	<input type="hidden" name="val" value="submitter-1" />
	<input type="hidden" name="_action" value="1" />
	<button type="submit" id="submit-1">Submit</button>
</Form>
<Form let:errors>
	<input type="hidden" name="val" value="submitter-2" />
	{#if errors.val && errors.val.length > 0}
		<p id="error-val-2">{errors.val}</p>
	{/if}
	<input type="hidden" name="_action" value="2" />
	<button type="submit" id="submit-2">Submit</button>
</Form>
<Form let:data>
	<input type="text" id="input-name" name="name" value={data?.name || ''} />
	<input type="text" id="input-birth" name="year_of_birth" value={data?.year_of_birth || ''} />
	<input type="hidden" name="_action" value="3" />
	<button type="submit" id="submit-3">Submit</button>
</Form>
<Form let:loading>
	<input type="hidden" name="_action" value="4" />
	{#if loading}
		<span id="loader">LOADING...</span>
	{/if}
	<button type="submit" id="submit-4">Submit</button>
</Form>
