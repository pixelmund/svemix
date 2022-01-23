import * as svemixHandlers from '$lib/server';

export const loader = () => ({ error: 'Test', status: 500 });

export const get = svemixHandlers.getHandler({
	hasMeta: false,
	loader: loader,
	metadata: () => ({})
});
