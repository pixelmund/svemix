import { goto, invalidate } from '$app/navigation';
import type {
	EnhanceFormError,
	EnhanceFormPending,
	EnhanceFormValidate,
	ValidationErrors
} from './types';

export type InternalEnhanceFormResult = ({
	data,
	redirectTo,
	refreshSession,
	formData,
	form,
	response
}: {
	data: Record<string, any>;
	formData: FormData;
	response: Response;
	form: HTMLFormElement;
	redirectTo: string;
	refreshSession: boolean;
}) => void | Promise<void>;

// this action (https://svelte.dev/tutorial/actions) allows us to
// progressively enhance a <form> that already works without JS
export function enhance(
	form: HTMLFormElement,
	{
		validate,
		pending,
		formError,
		result,
		errors
	}: {
		validate?: EnhanceFormValidate;
		pending?: EnhanceFormPending;
		formError?: EnhanceFormError;
		result?: InternalEnhanceFormResult;
		errors?: (errors: ValidationErrors) => any;
	} = {}
): { destroy: () => void } {
	let current_token: unknown;

	async function handle_submit(e: Event) {
		const token = (current_token = {});

		e.preventDefault();

		const data = new FormData(form);

		if (validate) {
			const validation_result = validate(data);
			if (Object.values(validation_result).some((err) => err.length > 0)) {
				return;
			}
		}

		if (pending) pending({ data, form });

		try {
			const response = await fetch(form.action, {
				credentials: 'include',
				method: form.method,
				headers: {
					accept: 'application/json'
				},
				body: data
			});

			if (token !== current_token) return;

			if (response.ok) {
				const redirectTo = response.headers.get('x-svemix-location') || '';

				if (redirectTo.length > 0) {
					if (result) {
						await result({
							formData: data,
							form,
							// @ts-ignore
							data: undefined,
							response: response,
							refreshSession: false,
							redirectTo
						});
					}
					goto(redirectTo);
					return;
				}

				let json: any = {};

				if (response.status !== 204) {
					json = await response.json();
				}

				const refreshSessionHeader = response.headers.get('x-svemix-refresh-session') || 'false';
				const refreshSession = refreshSessionHeader === 'true';

				if (result) {
					await result({
						formData: data,
						form,
						data: {},
						response: response,
						refreshSession,
						redirectTo
					});
				}

				let shouldInvalidate = true;

				const url = new URL(form.action);
				url.search = url.hash = '';

				if (json && json.errors) {
					if (Object.values<string>(json.errors).some((err) => err.length > 0)) {
						shouldInvalidate = false;
					}
				}

				if (shouldInvalidate) {
					await invalidate(url.href);
				}
			} else if (response.status === 400) {
				const json: any = await response.json();
				if (errors) {
					errors(json?.errors ?? {});
				}
			} else if (formError) {
				formError({ formData: data, form, error: null, response });
			} else {
				console.error(await response.text());
			}
		} catch (e: any) {
			console.log(e);

			if (formError) {
				formError({ formData: data, form, error: e, response: null });
			} else {
				throw e;
			}
		}
	}

	form.addEventListener('submit', handle_submit);

	return {
		destroy() {
			form.removeEventListener('submit', handle_submit);
		}
	};
}
