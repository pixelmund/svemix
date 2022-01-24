import { handleSession } from '$lib/session';
import { svemixHandler } from '$svemix';
import { sequence } from '@sveltejs/kit/hooks';

export const getSession = ({ locals }) => {
	return locals.session.data;
};

export const handle = sequence(
	handleSession<Locals>({
		key: 'svemix.testing',
		secret: '123456789101112'
	}),
	svemixHandler({})
);
