import type { Transformer } from './types';
import type { PipeDocument } from '../types';
declare const SSRTransformer: Transformer;
export default SSRTransformer;
export declare const ssrEndpointTemplate: ({
	ssrContent,
	doc
}: {
	ssrContent: string;
	doc: PipeDocument;
}) => string;
