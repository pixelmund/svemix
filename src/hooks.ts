import { handleSession } from '$lib/session';
import type { GetSession } from '@sveltejs/kit';

export const getSession : GetSession = ({ locals }) => {
	return locals.session.data;
};

export const handle = handleSession({
	key: 'svemix.testing',
	secret: '123456789101112',
	getSession
});
