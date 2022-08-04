import { read } from '$lib/server';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ params }) {
	try {
		const { prev, next, section } = await read('docs', params.slug);

		return {
			body: {
				prev,
				next,
				section: {
					file: section.file,
					title: section.title,
					content: section.content
				}
			}
		};
	} catch (error) {
		console.log(error);
		return {
			status: 404,
			body: 'Not found'
		};
	}
}
