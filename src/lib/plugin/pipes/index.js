import KeywordsPipe from './keywords.js';
import RoutesPipe from './routes.js';
import ScriptsPipe from './scripts.js';
import TransformerPipe from './transformer.js';
import ValidatorPipe from './validator.js';

/**
 * @type {import('./types').Pipe[]}
 */
const pipes = [ValidatorPipe, ScriptsPipe, KeywordsPipe, RoutesPipe, TransformerPipe];

export default pipes;
