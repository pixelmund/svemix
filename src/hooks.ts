import { handleSession } from '$lib/session';

export const handle = handleSession({
	key: 'svemix.testing',
	secret: '123456789101112'
});
