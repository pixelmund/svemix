import type { Load } from '@sveltejs/kit';

interface SvemixLoadHandler {
	routesName: string;
}

export default function loadHandler({ routesName }: SvemixLoadHandler): Load {
	return async ({ session, page, stuff, fetch }) => {
		// We have to do this because SvelteKit subscribes load to session changes if done so.
		const _accessSession = session?.something;

		try {
			const response = await fetch(routesName, {
				credentials: 'include',
				headers: { 'content-type': 'application/json' }
			});

			if (!response.ok) {
				throw new Error('An unknown error occured');
			}

			const loaded = await response.json();

			return loaded;
		} catch (err) {
			return {
				error: err,
				status: 500
			};
		}
	};
}
