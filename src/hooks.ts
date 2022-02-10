import { handleSession } from '$lib/session';

export const getSession = ({ locals }) => {
	return locals.session.data;
};

export const handle = handleSession({
	key: 'svemix.testing',
	secret: '123456789101112',
	getSession
});
