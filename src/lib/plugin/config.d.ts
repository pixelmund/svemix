import type { Config } from '@sveltejs/kit';
import type { MetaData } from '../meta';

export interface SvemixConfig extends Config {
	svemix: Svemix_Config_Object;
}

interface Svemix_Config_Object {
	seo?: Partial<MetaData>;
}

export interface InternalConfig extends Svemix_Config_Object {
	routes: string;
}
