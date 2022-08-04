import { read_headings } from '$lib/server';

export function GET() {
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
		console.log(error);
		return {
			status: 404,
			body: 'Not found'
		};
	}
}
