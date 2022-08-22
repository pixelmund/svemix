import type { ServerLoad } from '@sveltejs/kit';
import type { Action, Loader, MetaFn } from '.';

export function get(loader: Loader, metadata?: MetaFn): ServerLoad {
	return async (event) => {
		const result = await loader(event);

		let _metadata = {};
		if (metadata) {
			_metadata = await metadata(event, result as Record<string, any>);
		}

		return {
			metadata: _metadata,
			session: event.locals.session.data,
			...result,
		}
	};
}

export function post(action: Action): Action {
	return (event) => action(event)
}
