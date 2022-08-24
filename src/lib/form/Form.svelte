<script lang="ts">
	import type {
		EnhanceFormError,
		EnhanceFormPending,
		EnhanceFormResult,
		ValidationErrors
	} from './types';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { enhance } from './enhance';

	let errors : ValidationErrors = {};
	$: errors = $page.data?.errors || {};

	export let action: string = '';
	export let method: string = 'POST';

	export let validate: (data?: FormData) => ValidationErrors = () => ({});
	export let pending: EnhanceFormPending = () => {};
	export let error: EnhanceFormError = () => {};
	export let result: EnhanceFormResult = () => {};

	let className: string = '';
	let magicUrl = '';

	$: magicUrl = action.length > 0 ? action : $page.url.pathname;
	$: method = method !== 'POST' && method !== 'GET' ? 'POST' : method;

	let submitting: boolean = false;

	export { className as class };
</script>

<form
	action={magicUrl}
	{method}
	use:enhance={{
		validate: (data) => {
			const vErrors = validate(data);
			errors = vErrors;
			return errors;
		},
		errors: (errs) => {
			errors = errs;
		},
		pending: ({ data, form }) => {
			submitting = true;
			pending({ data, form });
		},
		formError: ({ formData, form, error: form_error, response }) => {
			submitting = false;
			error({ formData, form, error: form_error, response });
		},
		result: async ({ formData, data, form, response, redirectTo, refreshSession }) => {
			submitting = false;

			if (redirectTo && redirectTo.length > 0) {
				goto(redirectTo);
			}

			if (refreshSession) {
				const sessionResponse = await fetch('/__session.json');

				if (sessionResponse.ok) {
					const sessionData = await sessionResponse.json();
					// TODO: Figure out what to do with sessions
					// $session = sessionData.data;
				}
			}

			await result({ formData, data, form, response });
		}
	}}
	{...$$restProps}
>
	<fieldset class={className} disabled={submitting} aria-disabled={submitting}>
		<slot {errors} {submitting} />
	</fieldset>
</form>

<style>
	form {
		display: block;
		width: 100%;
	}

	fieldset {
		margin: 0;
		padding: 0;
		border: none;
	}
</style>
