export type Transformer = (args: {
	config: import('../config').InternalConfig;
	doc: import('../pipes/types').PipeDocument;
}) => string;
