import { get as __get, post as __post } from '$lib/server';

import type { Action } from '$lib';
import { makeCookie } from '$lib/cookie';

export const action: Action = () => {
	const trackingEnabledCookie = makeCookie('tracking_enabled', '1', {
		path: '/'
	});

	return {
		headers: {
			'set-cookie': [trackingEnabledCookie]
		}
	};
};

export const get = __get(() => ({}));
export const post = __post(action);
