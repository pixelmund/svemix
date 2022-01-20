export type Transformer = (args: {
	config: import('../../load_config').InternalConfig;
	doc: import('../types').PipeDocument;
}) => string;
