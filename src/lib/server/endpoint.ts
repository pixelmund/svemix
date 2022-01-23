import type { Handle } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit/types/hooks';
import type { Action, ActionResult, Loader, LoaderResult } from '.';
import type { MetaFunction } from '../meta';

export interface SvemixHandler {
	loader?: Loader;
	metadata?: MetaFunction<any>;
	action?: Action;
}

export type SvemixRoutes = Array<{ pattern: RegExp; handler: SvemixHandler, params: any }>;

export function serverHandler({ routes }: { routes: SvemixRoutes }): Handle {

	return async ({ event, resolve }) => {
		let _data = event.url.searchParams.get('_data');

		if (!_data && event.request.method === 'GET') {
			return resolve(event);
		}

		if (!_data) {
			_data = event.url.pathname;
		}

		let matchedRoute: { pattern: RegExp; handler: SvemixHandler, params: any };
		let decoded = decodeURI(event.url.pathname);
		let match : any;

		for (const route of routes) {
			const matches = route.pattern.exec(decoded);
			if (!matches) continue;
			matchedRoute = route;
			match = matches;
		}

		if (!matchedRoute || !matchedRoute.handler) {
			return resolve(event);
		}

		const handler= matchedRoute.handler;
		event.params = matchedRoute.params ? decode_params(matchedRoute.params(match)) : {};

		if (event.request.method === 'GET') {
			if (!handler.loader && !handler.metadata) {
				return resolve(event);
			}

			let loaderResult: LoaderResult<any> | undefined = { props: {} };

			if (handler.loader) {
				loaderResult = await handler.loader(event);
			}

			if (handler.metadata) {
				const metaProps = await handler.metadata(loaderResult.props);
				loaderResult.props._metadata = metaProps;
			}

			const headers = new Headers({
				...(loaderResult?.headers || {}),
				'content-type': 'application/json'
			});

			return new Response(JSON.stringify(loaderResult), { status: 200, headers });
		}

		if (event.request.method === 'POST') {
			if (!handler.action) {
				return resolve(event);
			}

			const actionResult = await handler.action(event);

			if (event.request.headers.get('accept') === 'application/json') {
				const hasSession = 'session' in event.locals;

				let shouldSendSession = false;

				if (hasSession) {
					shouldSendSession = event.locals.session.shouldSendToClient;
				}

				const headers = new Headers({
					...(actionResult?.headers || {}),
					'content-type': 'application/json'
				});

				return new Response(
					JSON.stringify({
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
					}),
					{ status: 200, headers }
				);
			}

			if (!actionResult?.redirect) {
				return jsDisabledFormRedirect(event, actionResult);
			}

			return new Response('', {
				status: 302,
				headers: new Headers({ ...(actionResult?.headers || {}), Location: actionResult.redirect })
			});
		}

		return resolve(event);
	};
}

function jsDisabledFormRedirect(event: RequestEvent<any>, actionResult: ActionResult<any, any>) {
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

	return new Response('', {
		status: 302,
		headers: new Headers({ ...(actionResult?.headers || {}), Location: location })
	});
}

/**
 * @param {string} part
 * @param {string} file
 */
export function get_parts(part: string, file: string) {
	/** @type {Part[]} */
	const result = [];
	part.split(/\[(.+?\(.+?\)|.+?)\]/).map((str, i) => {
		if (!str) return;
		const dynamic = i % 2 === 1;

		const [, content] = dynamic ? /([^(]+)$/.exec(str) || [null, null] : [null, str];

		if (!content || (dynamic && !/^(\.\.\.)?[a-zA-Z0-9_$]+$/.test(content))) {
			throw new Error(`Invalid route ${file} — parameter name must match /^[a-zA-Z0-9_$]+$/`);
		}

		result.push({
			content,
			dynamic,
			rest: dynamic && /^\.{3}.+$/.test(content)
		});
	});

	return result;
}

/**
 * @param {Part[][]} segments
 * @param {boolean} add_trailing_slash
 */
export function get_pattern(segments: any[][], add_trailing_slash: boolean = false) {
	const path = segments
		.map((segment) => {
			if (segment.length === 1 && segment[0].rest) {
				// special case — `src/routes/foo/[...bar]/baz` matches `/foo/baz`
				// so we need to make the leading slash optional
				return '(?:\\/(.*))?';
			}

			const parts = segment.map((part) => {
				if (part.rest) return '(.*?)';
				if (part.dynamic) return '([^/]+?)';

				return (
					part.content
						// allow users to specify characters on the file system in an encoded manner
						.normalize()
						// We use [ and ] to denote parameters, so users must encode these on the file
						// system to match against them. We don't decode all characters since others
						// can already be epressed and so that '%' can be easily used directly in filenames
						.replace(/%5[Bb]/g, '[')
						.replace(/%5[Dd]/g, ']')
						// '#', '/', and '?' can only appear in URL path segments in an encoded manner.
						// They will not be touched by decodeURI so need to be encoded here, so
						// that we can match against them.
						// We skip '/' since you can't create a file with it on any OS
						.replace(/#/g, '%23')
						.replace(/\?/g, '%3F')
						// escape characters that have special meaning in regex
						.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
				);
			});

			return '\\/' + parts.join('');
		})
		.join('');

	const trailing = add_trailing_slash && segments.length ? '\\/?$' : '$';

	return new RegExp(`^${path || '\\/'}${trailing}`);
}

/** @param {string[]} array */
export function get_params(array: string[]) {
	// given an array of params like `['x', 'y', 'z']` for
	// src/routes/[x]/[y]/[z]/svelte, create a function
	// that turns a RegExpExecArray into ({ x, y, z })

	/** @param {RegExpExecArray} match */
	const fn = (match) => {
		/** @type {Record<string, string>} */
		const params = {};
		array.forEach((key, i) => {
			if (key.startsWith('...')) {
				params[key.slice(3)] = match[i + 1] || '';
			} else {
				params[key] = match[i + 1];
			}
		});
		return params;
	};

	return fn;
}

/** @param {Record<string, string>} params */
export function decode_params(params: Record<string, string>) {
	for (const key in params) {
		// input has already been decoded by decodeURI
		// now handle the rest that decodeURIComponent would do
		params[key] = params[key]
			.replace(/%23/g, '#')
			.replace(/%3[Bb]/g, ';')
			.replace(/%2[Cc]/g, ',')
			.replace(/%2[Ff]/g, '/')
			.replace(/%3[Ff]/g, '?')
			.replace(/%3[Aa]/g, ':')
			.replace(/%40/g, '@')
			.replace(/%26/g, '&')
			.replace(/%3[Dd]/g, '=')
			.replace(/%2[Bb]/g, '+')
			.replace(/%24/g, '$');
	}

	return params;
}
