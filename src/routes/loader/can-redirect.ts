import { get as __get, post as __post } from '$lib/server';

import { redirect } from '$lib/server';
export const loader = () => redirect('/loader/redirect-target', 302);

export const get = __get(loader);
