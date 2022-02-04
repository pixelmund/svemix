import { invalidate } from '$app/navigation';
import type {
	EnhanceFormError,
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
		error,
		result
	}: {
		validate?: EnhanceFormValidate;
		pending?: EnhanceFormPending;
		error?: EnhanceFormError;
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
				if (result) {
					const json = await response.json();
					result({ data, form, response: json?.actionData });
				}

				const url = new URL(form.action);
				url.search = url.hash = '';
				invalidate(url.href);
			} else if (error) {
				error({ data, form, error: null, response });
			} else {
				const errorText = await response.text();
				console.error(errorText);
				error({ data, form, error: new Error(errorText), response });
			}
		} catch (e: any) {
			if (error) {
				error({ data, form, error: e, response: null });
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
