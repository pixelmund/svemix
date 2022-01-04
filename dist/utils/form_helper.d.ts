import type { Writable } from 'svelte/store';
interface FormState {
	id: number;
	loading: boolean;
	data: any;
	errors: Record<string, string>;
	formError: string;
	redirect: string;
}
export declare type FormContext = Writable<FormState>;
export declare function createForm(): Writable<FormState>;
export declare function getFormData(form: HTMLFormElement): {
	formData: FormData;
	formObject: {};
};
export declare function parseQuery(input: string[]): {};
export {};
