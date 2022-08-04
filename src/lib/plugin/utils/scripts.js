export const SCRIPTS_REGEX = /<script([^>]*?)>([\s\S]+?)<\/script>/gm;

/**
 *
 * @param {string} content
 * @returns {import('../types').ParsedScript[]}
 */
export function getScripts(content) {
	const scripts = [];

	let match;
	while ((match = SCRIPTS_REGEX.exec(content))) {
		const attrs = match[1]
			.split(' ')
			.map((str) => str.trim())
			.filter(Boolean)
			.map((str) => {
				const [name, quoted_value] = str.split('=');
				const value = quoted_value ? quoted_value.replace(/^['"]/, '').replace(/['"]$/, '') : true;

				return { name, value };
			})
			.reduce((attrs, { name, value }) => {
				// @ts-ignore
				attrs[name] = value;
				return attrs;
			}, {});

		scripts.push({ attrs, content: match[2] });
	}

	return scripts;
}
