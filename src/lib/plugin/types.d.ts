import type { SvemixConfig, InternalConfig } from '../config';
import type { Config } from '@sveltejs/kit';
import type { MetaData } from '../meta';

export type ParsedScript = {
	attrs: { context?: string; lang?: string; ssr?: boolean };
	content: string;
};

export interface SvemixConfig extends Config {
	svemix: Svemix_Config_Object;
}

interface Svemix_Config_Object {
	seo?: Partial<MetaData>;
}

export interface InternalConfig extends Svemix_Config_Object {
	routes: string;
}

export interface SvemixRoute {
	routeId: string;
	isIndex: boolean;
	isLayout: boolean;
	content: () => string;
	serverScript: () => { available: boolean; lang: 'ts' | 'js', content: string }
}

export type UnionOfArrayElements<ARR_T extends Readonly<unknown[]>> = ARR_T[number];