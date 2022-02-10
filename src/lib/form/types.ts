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
	formData,
	form,
	response,
	error
}: {
	formData: FormData;
	form: HTMLFormElement;
	response: Response | null;
	error: Error | null;
}) => void;
export type EnhanceFormResult = ({
	formData,
	form,
	response
}: {
	data: Record<string, any>;
	formData: FormData;
	response: Response;
	form: HTMLFormElement;
}) => void | Promise<void>;
