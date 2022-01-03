import type { Pipe, PipeParsedScript } from '../types';

export const SCRIPTS_REGEX = /<script([^>]*?)>([\s\S]+?)<\/script>/gm;

const ScriptsPipe: Pipe = async function ScriptsPipe(args) {
	let { config, doc } = args;

	const scripts = getScripts(doc.content);

	if (scripts.length === 0) {
		return {
			doc,
			config,
			continue: false
		};
	}

	const ssr = scripts.find((script) => script.attrs?.context === 'module' && script.attrs?.ssr);

	if (!ssr) {
		return {
			config,
			continue: false,
			doc
		};
	}

	const dom = scripts.find((script) => script.attrs?.context === 'module' && !script.attrs?.ssr);
	const instance = scripts.find((script) => !script.attrs?.context);

	doc.scripts = {
		dom,
		instance,
		ssr,
		arr: scripts
	};

	return {
		config,
		continue: true,
		doc
	};
};

export default ScriptsPipe;

export function getScripts(content: string): PipeParsedScript[] {
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
				attrs[name] = value;
				return attrs;
			}, {});

		scripts.push({ attrs, content: match[2] });
	}

	return scripts;
}
