import { resolve } from 'path';

export const SVEMIX_LIB_DIR = process.env.TEST == 'true' ? '$lib' : 'svemix';
export const SVEMIX_GENERATED_DIR = resolve(process.cwd(), '.svelte-kit', 'svemix');
export const SVEMIX_GENERATED_INDEX = resolve(SVEMIX_GENERATED_DIR, 'index.js');
