
  import { getHandler, postHandler } from "$lib/server";

  
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


  

  
  export const post = postHandler({
    action: action,
  });  
  
