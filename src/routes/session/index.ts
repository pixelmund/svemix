import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = ({ locals }) => {
	let views = locals.session.data?.views || 0;
	views = views + 1;

	locals.session.data = { views };

	return {
		body: {
			session: locals.session.data
		}
	};
};

export const del: RequestHandler<Locals, any, any> = ({ locals }) => {
	locals.session.destroy();

	return {
		status: 200,
		body: {
			deleted: locals.session.shouldSendToClient,
			session: Object.keys(locals.session.data).length > 0 ? locals.session.data : null
		}
	};
};
