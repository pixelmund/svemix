import { invalidate } from '$app/navigation';
import type { ActionData } from '$lib';
import type {
	EnhanceFormErrors,
	EnhanceFormFormError,
	EnhanceFormPending,
	EnhanceFormResult,
	EnhanceFormValidate
} from './types';

// this action (https://svelte.dev/tutorial/actions) allows us to
// progressively enhance a <form> that already works without JS
export function enhance(
	form: HTMLFormElement,
	{
		validate,
		pending,
		formError,
		errors,
		result
	}: {
		validate?: EnhanceFormValidate;
		pending?: EnhanceFormPending;
		errors?: EnhanceFormErrors;
		formError?: EnhanceFormFormError;
		result?: EnhanceFormResult;
	} = {}
): { destroy: () => void } {
	let current_token: unknown;

	async function handle_submit(e: Event) {
		const token = (current_token = {});

		e.preventDefault();

		const data = new FormData(form);

		if (validate) {
			const validation_result = validate({ data });
			if (Object.values(validation_result).some((err) => err.length > 0)) {
				return;
			}
		}

		if (pending) pending({ data, form });

		try {
			const response = await fetch(form.action, {
				method: form.method,
				headers: {
					accept: 'application/json'
				},
				body: data
			});

			if (token !== current_token) return;

			if (response.ok) {
				const json = await response.json();
				const actionData = json?.actionData as ActionData;

				if (!actionData) {
					throw new Error('Could not load action data');
				}

				if (actionData.formError && actionData.formError.length > 0) {
					throw new Error(actionData.formError);
				}

				if (
					actionData.errors &&
					Object.values(actionData.errors).some((err) => err.length > 0) &&
					errors
				) {
					errors({ data, form, errors: actionData.errors });
					return;
				}

				if (result) {
					result({ data, form, response: actionData });
				}

				const url = new URL(form.action);
				url.search = url.hash = '';
				invalidate(url.href);
			} else if (formError) {
				formError({ data, form, error: null, response });
			} else {
				console.error(await response.text());
			}
		} catch (e: any) {
			if (formError) {
				formError({ data, form, error: e, response: null });
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
