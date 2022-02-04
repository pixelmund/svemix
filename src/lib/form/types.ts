import type { ActionData } from "$lib";

export type ValidationErrors = Record<string, string | string[]>;

export type EnhanceFormValidate = ({ data }: { data: FormData }) => ValidationErrors;
export type EnhanceFormPending = ({
	data,
	form
}: {
	data: FormData;
	form: HTMLFormElement;
}) => void;
export type EnhanceFormError = ({
	data,
	form,
	response,
	error
}: {
	data: FormData;
	form: HTMLFormElement;
	response: Response | null;
	error: Error | null;
}) => void;
export type EnhanceFormResult = ({
	data,
	form,
	response
}: {
	data: FormData;
	response: ActionData;
	form: HTMLFormElement;
}) => void;
