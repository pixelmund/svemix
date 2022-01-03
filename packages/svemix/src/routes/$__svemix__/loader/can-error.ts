import { getHandler, postHandler } from '$lib/server';

export const loader = () => ({ error: 'Test', status: 500 });

export const get = getHandler({
	hasMeta: false,
	loader: loader,
	metadata: () => ({})
});
