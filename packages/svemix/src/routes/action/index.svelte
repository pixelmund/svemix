<script context="module" ssr lang="ts">
	import type { Action } from '$lib';

	export const action: Action = async ({ body }) => {
		const _action = body.get('_action');

		console.log(_action);

		const wait = (timeout: number) => new Promise((res) => setTimeout(res, timeout));

		switch (_action) {
			case '1':
				const val = body.get('val');
				return {
					status: 302,
					redirect: '/action/success?val=' + val
				};
			case '2':
				const val2 = body.get('val');
				await wait(3000);

				return {
					data: {
						val2
					}
				};
			default:
				break;
		}
	};
</script>

<script>
	import { Form } from '$lib';
</script>

<Form>
	<input type="hidden" name="val" value="submitter-1" />
	<input type="hidden" name="_action" value="1" />
	<button type="submit" id="submit-1">Submit</button>
</Form>
<Form>
	<input type="hidden" name="val" value="submitter-2" />
	<input type="hidden" name="_action" value="2" />
	<button type="submit" id="submit-2">Submit</button>
</Form>
