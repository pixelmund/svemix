import { get as __get, post as __post } from '$lib/server';

import type { Loader } from '$lib';

interface LoaderData {
	name: string;
	age: number;
	country: string;
}

export const loader: Loader<LoaderData> = () => ({
	data: { name: 'Svemix', age: 25, country: 'Github' }
});

export const get = __get(loader);
