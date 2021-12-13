/** @type {import('svelte/store').Writable<{loading: boolean;
    data: any;
    errors: Record<string, string>;
    formError: string;}>} */
export const formState: import("svelte/store").Writable<{
  loading: boolean;
  data: any;
  errors: Record<string, string>;
  formError: string;
}>;
/** @typedef {typeof __propDef.props}  FormProps */
/** @typedef {typeof __propDef.events}  FormEvents */
/** @typedef {typeof __propDef.slots}  FormSlots */
export default class Form extends SvelteComponentTyped<
  {
    [x: string]: any;
    action?: string;
  },
  {
    submit: CustomEvent<any>;
  } & {
    [evt: string]: CustomEvent<any>;
  },
  {
    default: {
      loading: boolean;
      errors: Record<string, string>;
      data: any;
      formError: string;
    };
  }
> {}
export type FormProps = typeof __propDef.props;
export type FormEvents = typeof __propDef.events;
export type FormSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {
    [x: string]: any;
    action?: string;
  };
  events: {
    submit: CustomEvent<{
      loading: boolean;
      data: any;
      errors: Record<string, string>;
      formError: string;
    }>;
  } & {
    [evt: string]: CustomEvent<any>;
  };
  slots: {
    default: {
      loading: boolean;
      errors: Record<string, string>;
      data: any;
      formError: string;
    };
  };
};
export {};
