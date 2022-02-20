import { read_headings } from '$lib/server';

export function get() {
	return {
		body: read_headings('docs').map(({ slug, title, sections }) => ({ slug, title, sections }))
	};
}
