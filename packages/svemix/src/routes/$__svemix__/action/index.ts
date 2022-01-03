
  import { getHandler, postHandler } from "$lib/server";

  
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


  

  
  export const post = postHandler({
    action: action,
  });  
  
