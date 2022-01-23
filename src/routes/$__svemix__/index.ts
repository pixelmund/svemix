import * as svemixHandlers from '$lib/server';

export const loader = () => ({
	props: {
		book: {
			getYearsSincePublication() {
				return new Date();
			}
		}
	}
});

export const get = svemixHandlers.getHandler({
	hasMeta: false,
	loader: loader,
	metadata: () => ({})
});
