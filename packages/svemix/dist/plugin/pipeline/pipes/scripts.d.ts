import type { Pipe, PipeParsedScript } from '../types';
export declare const SCRIPTS_REGEX: RegExp;
declare const ScriptsPipe: Pipe;
export default ScriptsPipe;
export declare function getScripts(content: string): PipeParsedScript[];
