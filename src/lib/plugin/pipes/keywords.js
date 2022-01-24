/**
 * @type {import('./types').Pipe}
 */
const KeywordsPipe = async function (args) {
	let { config, doc } = args;

	const keywords = doc.functions;

	/**
	 *
	 * @param {string} keyword
	 * @returns {string[]}
	 */
	const createKeywords = (keyword) => [
		`export const ${keyword}`,
		`export let ${keyword}`,
		`export function ${keyword}`,
		`export async function ${keyword}`
	];

	Object.keys(keywords).forEach((keyword) => {
		const keywordArr = createKeywords(keyword);
		keywordArr.forEach((k) => {
			if (doc.scripts.ssr.content.includes(k)) {
				keywords[keyword] = true;
			}
		});
	});

	doc.functions = keywords;

	// TODO: this is probably a bit to hacky...
	if (doc.scripts.ssr.content.includes('prerender = true')) {
		doc.prerender = true;
	} else if (doc.scripts.ssr.content.includes('prerender = false')) {
		doc.prerender = false;
	}

	if (Object.values(doc.functions).every((value) => value === false)) {
		return {
			config,
			continue: false,
			doc
		};
	}

	return {
		config,
		continue: true,
		doc
	};
};

export default KeywordsPipe;
