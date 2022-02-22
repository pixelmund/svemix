import { get as __get, post as __post } from '$lib/server';

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

export const get = __get(() => ({}));
export const post = __post(action);
