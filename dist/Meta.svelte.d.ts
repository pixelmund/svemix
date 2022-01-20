import { SvelteComponentTyped } from 'svelte';
import type { MetaResult } from './meta';
declare const __propDef: {
	props: {
		_metadata?: MetaResult;
		_defaults?: MetaResult;
	};
	events: {
		[evt: string]: CustomEvent<any>;
	};
	slots: {};
};
export declare type MetaProps = typeof __propDef.props;
export declare type MetaEvents = typeof __propDef.events;
export declare type MetaSlots = typeof __propDef.slots;
export default class Meta extends SvelteComponentTyped<MetaProps, MetaEvents, MetaSlots> {}
export {};
