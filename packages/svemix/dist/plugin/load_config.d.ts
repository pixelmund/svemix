import type { Config } from '@sveltejs/kit';
import type { MetaResult } from '../meta';
export interface SvemixConfig extends Config {
    svemix: Svemix_Config_Object;
}
interface Svemix_Config_Object {
    prerenderAll?: boolean;
    seo?: Partial<MetaResult>;
}
export interface InternalConfig extends Svemix_Config_Object {
    routes: string;
}
export declare const defaultConfig: InternalConfig;
export default function load_config({ cwd }?: {
    cwd?: string;
}): Promise<InternalConfig>;
export {};
