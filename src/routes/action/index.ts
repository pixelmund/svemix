import { get as __get, post as __post } from '$lib/server';

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

			return {};

		case '5':
			//@ts-expect-error
			locals.session.data = { isLoggedIn: true };

			return {};

		default:
			return {};
	}
};

export const get = __get(() => ({}));
export const post = __post(action);
