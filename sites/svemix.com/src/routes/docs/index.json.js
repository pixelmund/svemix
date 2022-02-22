import { read_headings } from '$lib/server';

export function get() {
	try {
		const headings = read_headings('docs').map(({ slug, title, sections }) => ({
			slug,
			title,
			sections
		}));
		return {
			body: headings
		};
	} catch (error) {
		return {
			status: 404,
			body: 'Not found'
		};
	}
}
