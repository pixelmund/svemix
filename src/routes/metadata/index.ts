import { get as __get, post as __post } from '$lib/server';

import type { Loader } from '$lib';

export const loader: Loader = () => ({ metadata: { title: 'Custom Title' } });

export const get = __get(loader);
