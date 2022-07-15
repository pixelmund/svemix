import { get as __get, post as __post } from '$lib/server';

import type { Loader } from '$lib';

export const loader: Loader = () => ({
	status: 404,
	error: new Error('My Custom Error')
});

export const get = __get(loader);
