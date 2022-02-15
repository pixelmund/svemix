import type { MetaData } from '$lib';
import { mergeObjects } from '$lib/utils';
import { setContext, getContext } from 'svelte';
import { Writable, writable } from 'svelte/store';

const SVEMIX_CONTEXT_KEY = '__svemix__';

interface SvemixContext {
	loaderDataStore: Writable<Record<string, any>>;
	actionDataStore: Writable<Record<string, any>>;
	metaDataStore: Writable<MetaData>;
}

export function getMetaData(): Writable<MetaData> {
	return getContext<SvemixContext>(SVEMIX_CONTEXT_KEY).metaDataStore;
}

export function getLoaderData<T extends Record<string, any> = Record<string, any>>(): Writable<T> {
	return getContext<SvemixContext>(SVEMIX_CONTEXT_KEY).loaderDataStore as Writable<T>;
}

export function getActionData<T extends Record<string, any> = Record<string, any>>(): Writable<T> {
	return getContext<SvemixContext>(SVEMIX_CONTEXT_KEY).actionDataStore as Writable<T>;
}

const updateSvemixStore = (store: Writable<any>, data: any) => {
	store.update((state) => {
		return mergeObjects(state || {}, data);
	});
};

export function updateSvemixContext(
	{ loaderDataStore, actionDataStore, metaDataStore }: SvemixContext,
	props: any[]
) {
	const { loaderData, actionData, metaData } = updateSvemixFromProps(props);
	updateSvemixStore(loaderDataStore, loaderData);
	updateSvemixStore(actionDataStore, actionData);
	updateSvemixStore(metaDataStore, metaData);
}

export function createSvemixContext(props: any[]) {
	const { loaderData, actionData, metaData } = updateSvemixFromProps(props);

	const loaderDataStore = writable(loaderData);
	const actionDataStore = writable(actionData);
	const metaDataStore = writable(metaData);

	setContext<SvemixContext>(SVEMIX_CONTEXT_KEY, {
		loaderDataStore,
		actionDataStore,
		metaDataStore
	});

	return { loaderDataStore, actionDataStore, metaDataStore };
}

function updateSvemixFromProps(props: any[]) {
	let loaderData: Record<string, any> = {};
	let actionData: Record<string, any> = {};
	let metaData: MetaData = {};

	props.forEach((prop) => {
		if (prop == null) return;
		if ('data' in prop) {
			loaderData = { ...loaderData, ...prop.data };
		}
		if ('actionData' in prop) {
			actionData = { ...actionData, ...prop.actionData };
		}
		if ('metadata' in prop) {
			metaData = { ...metaData, ...prop.metadata };
		}
	});

	return {
		loaderData,
		actionData,
		metaData
	};
}
