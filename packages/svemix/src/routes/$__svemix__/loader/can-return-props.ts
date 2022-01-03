import { getHandler, postHandler } from '$lib/server';

export const loader = () => ({ props: { name: 'Svemix', age: 25, country: 'Github' } });

export const get = getHandler({
	hasMeta: false,
	loader: loader,
	metadata: () => ({})
});
