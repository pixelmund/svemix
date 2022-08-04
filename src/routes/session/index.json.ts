// @ts-nocheck
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ locals }) => {
	let views = locals.session.data?.views || 0;
	views = views + 1;

	locals.session.data = { views };

	return {
		body: {
			session: locals.session.data
		}
	};
};

export const DELETE: RequestHandler = ({ locals }) => {
	locals.session.destroy();

	return {
		status: 200,
		body: {
			deleted: locals.session.shouldSendToClient,
			session: Object.keys(locals.session.data).length > 0 ? locals.session.data : null
		}
	};
};
