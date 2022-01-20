export function getHandler({ hasMeta, loader, metadata }) {
	return async (event) => {
		const loaded = await loader(event);
		if (loaded?.error || loaded?.redirect) {
			return {
				headers: loaded?.headers || {},
				body: {
					props: { _metadata: {} },
					error: loaded?.error,
					status: loaded?.status,
					redirect: loaded?.redirect,
					maxage: loaded?.maxage
				}
			};
		}
		let _metadata = {};
		if (hasMeta) {
			_metadata = await metadata(loaded?.props);
		}
		const loadedProps = loaded?.props || {};
		const metaProps = { _metadata };
		return {
			headers: loaded?.headers || {},
			body: {
				props: { ...loadedProps, ...metaProps },
				error: loaded?.error,
				status: loaded?.status,
				redirect: loaded?.redirect,
				maxage: loaded?.maxage
			}
		};
	};
}
export function postHandler({ action }) {
	return async (event) => {
		const actionResult = await action(event);
		// This is a browser fetch
		if (event.request.headers && event.request.headers.get('accept') === 'application/json') {
			const hasSession = 'session' in event.locals;
			let shouldSendSession = false;
			if (hasSession) {
				shouldSendSession = event.locals.session.shouldSendToClient;
			}
			return {
				headers: actionResult?.headers || {},
				body: {
					redirect: actionResult?.redirect,
					formError: actionResult?.formError,
					data: actionResult?.data,
					errors: actionResult?.errors,
					status: actionResult?.status,
					// TODO: this should somehow execute the users hooks getSession, or the user has to define it inside the svelte.config.js?,
					session: {
						status: shouldSendSession ? 'should-update' : 'no-changes',
						data: shouldSendSession ? event.locals.session?.data : {}
					}
				}
			};
		}
		// This is the default form behaviour, navigate back to form submitter
		if (!actionResult?.redirect) {
			return jsDisabledFormRedirect(event, actionResult);
		}
		return {
			headers: {
				...(actionResult?.headers || {}),
				Location: actionResult?.redirect
			},
			status: actionResult?.status || 302,
			body: {}
		};
	};
}
function jsDisabledFormRedirect(event, actionResult) {
	let location = event.request.headers.get('referer');
	const params = new URLSearchParams();
	if (actionResult?.errors) {
		Object.keys(actionResult.errors).forEach((key) => {
			const value = actionResult.errors[key];
			if (value && value.length > 0) {
				params.append(`errors[]`, `${key}::${value}`);
			}
		});
	}
	if (actionResult?.formError && actionResult.formError.length > 0) {
		params.append(`formError`, actionResult.formError);
	}
	if (actionResult?.data) {
		Object.keys(actionResult.data).forEach((key) => {
			const value = actionResult.data[key];
			if (value && value.length > 0) {
				params.append(`data[]`, `${key}::${value}`);
			}
		});
	}
	if (location.includes('?')) {
		const [referer] = location.split('?');
		location = referer;
	}
	const searchParams = params.toString();
	if (searchParams.length > 0) {
		location += '?' + searchParams;
	}
	return {
		headers: {
			...(actionResult?.headers || {}),
			Location: location
		},
		status: actionResult?.status || 302,
		body: {}
	};
}
