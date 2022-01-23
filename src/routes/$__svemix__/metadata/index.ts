import * as svemixHandlers from '$lib/server';

export const metadata = () => ({ title: 'Custom Title' });

export const get = svemixHandlers.getHandler({
	hasMeta: true,
	loader: () => ({}),
	metadata: metadata
});
