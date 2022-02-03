import type { SvemixConfig, InternalConfig } from '../config';

export type PipeParsedScript = {
	attrs: { context?: string; lang?: string; ssr?: boolean };
	content: string;
};

export type PipeDocument = {
	filename: string;
	content: string;
	functions: {
		loader: boolean;
		action: boolean;
	};
	scripts: {
		arr?: PipeParsedScript[];
		dom?: PipeParsedScript;
		ssr?: PipeParsedScript;
		instance?: PipeParsedScript;
	};
};

export type PipeArgs = {
	config: InternalConfig;
	doc: PipeDocument;
};

export type PipeResult = {
	continue: boolean;
	doc: PipeDocument;
	config: InternalConfig;
};

export type Pipe = (args: PipeArgs) => Promise<PipeResult>;

export type PipeLine = (args: PipeArgs) => Promise<{ code: string }>;
