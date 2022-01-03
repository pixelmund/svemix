import pipes from './pipes/index.js';
const Pipeline = async function (pipelineArgs) {
	let { config, doc } = pipelineArgs;
	for (const pipe of pipes) {
		const result = await pipe({ config, doc });
		config = result.config;
		doc = result.doc;
		// We should stop the pipeline, because of a validation error or no need to continue
		if (!result.continue) {
			return {
				code: result.doc.content
			};
		}
	}
	return {
		code: doc.content
	};
};
export default Pipeline;
