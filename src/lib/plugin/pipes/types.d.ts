import type { SvemixConfig, InternalConfig } from '../config';

export type PipeParsedScript = {
	attrs: { context?: string; lang?: string; ssr?: boolean };
	content: string;
};

export type PipeDocument = {
	filename: string;
	content: string;
	prerender: 'all' | boolean;
	functions: {
		loader: boolean;
		metadata: boolean;
		action: boolean;
	};
	scripts: {
		arr?: PipeParsedScript[];
		dom?: PipeParsedScript;
		ssr?: PipeParsedScript;
		instance?: PipeParsedScript;
	};
	route: {
		name?: string;
		path?: string;
		data_name?: string;
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
