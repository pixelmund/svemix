import ValidatorPipe from "./pipes/validator.js";
import ScriptsPipe from "./pipes/scripts.js";
import KeywordsPipe from "./pipes/keywords.js";
import RoutesPipe from "./pipes/routes.js";
import TransformerPipe from "./pipes/transformer.js";

/** @type {Array<import('./types').Pipe>} */
const pipes = [ValidatorPipe, ScriptsPipe, KeywordsPipe, RoutesPipe, TransformerPipe];

/** @type {import('./types').PipeLine} */
export default async function Pipeline(pipelineArgs) {
  let { config, doc } = pipelineArgs;

  for (const pipe of pipes) {
    const result = await pipe({ config, doc });
    config = result.config;
    doc = result.doc;

    // We should stop the pipeline, because of a validation error or no need to continue
    if (!result.continue) {
      return {
        code: result.doc.content,
      };
    }
  }

  return {
    code: doc.content,
  };
}
