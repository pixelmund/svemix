import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	let views = locals.session.data?.views || 0;
	views = views + 1;

	await locals.session.set({ views });

	return {
		body: {
			session: locals.session.data as {}
		}
	};
};

export const DELETE: RequestHandler = async ({ locals }) => {
	await locals.session.destroy();

	return {
		status: 200,
		body: {
			deleted: locals.session.shouldSync,
			session: Object.keys(locals.session.data).length > 0 ? locals.session.data : null as any
		}
	};
};
