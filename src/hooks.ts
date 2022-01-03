import { handleSession } from '$lib/session';

export const handle = handleSession<Locals>({
	key: 'svemix.testing',
	secret: '123456789101112'
});

export const getSession = ({ locals }) => {
	return locals.session.data;
};
