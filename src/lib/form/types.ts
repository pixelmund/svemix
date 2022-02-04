import type { ActionData } from '../';

export type ValidationErrors = Record<string, string | string[]>;

export type EnhanceFormValidate = ({ data }: { data: FormData }) => ValidationErrors;
export type EnhanceFormPending = ({
	data,
	form
}: {
	data: FormData;
	form: HTMLFormElement;
}) => void;
export type EnhanceFormFormError = ({
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
export type EnhanceFormErrors = ({
	data,
	form,
	errors
}: {
	data: FormData;
	form: HTMLFormElement;
	errors: ValidationErrors;
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
