import type { Config } from '@sveltejs/kit';
import type { MetaResult } from '$lib/meta';

export interface SvemixConfig extends Config {
	svemix: Svemix_Config_Object;
}

interface Svemix_Config_Object {
	prerenderAll?: boolean;
	seo?: Partial<MetaResult>;
}

export interface InternalConfig extends Svemix_Config_Object {
	trailingSlash: boolean;
	routes: string;
}
