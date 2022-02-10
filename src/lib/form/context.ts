import { getContext } from 'svelte';
import type { Writable } from 'svelte/store';

export function getActionData<
	Data extends Writable<Record<string, any>> = Writable<Record<string, any>>
>() {
	return getContext<Data>('svemix-action-data');
}
