import * as svemixHandlers from '$lib/server';

export const loader = () => ({ status: 302, redirect: '/loader/redirect-target' });

export const get = svemixHandlers.getHandler({
	hasMeta: false,
	loader: loader,
	metadata: () => ({})
});
