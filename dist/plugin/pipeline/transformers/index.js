import InstanceTransformer from './instance.js';
import SSRTransformer from './ssr.js';
const transformers = {
	ssr: SSRTransformer,
	instance: InstanceTransformer
};
export default transformers;
