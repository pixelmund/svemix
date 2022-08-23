import { redirect, type ServerLoad } from '@sveltejs/kit';
import type { Action, Loader, MetaFn } from '.';
import { Redirect } from './utils.js';

export function get(loader: Loader, metadata?: MetaFn): ServerLoad {
	return async (event) => {
		const result = await loader(event);

		if (result instanceof Redirect) {
			throw redirect(result.status, result.location);
		}

		let _metadata = {};
		if (metadata) {
			_metadata = await metadata(event, result as Record<string, any>);
		}

		return {
			metadata: _metadata,
			session: event.locals.session?.data ?? {},
			...result,
		}
	};
}

export function post(action: Action): Action {
	return async (event) => {
		const result = await action(event);
		const isNativeSubmission = !((event.request.headers.get('accept') ?? '').includes('application/json'));

		if (result instanceof Redirect) {
			event.setHeaders({ 'x-svemix-location': result.location });
			if (isNativeSubmission) {
				throw redirect(result.status, result.location);
			}
		}

		return result;
	}
}
