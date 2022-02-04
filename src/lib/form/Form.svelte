<script lang="ts">
	import type { ActionData } from '$lib/server';
	import type { Writable } from 'svelte/store';
	import type {
		EnhanceFormFormError,
		EnhanceFormPending,
		EnhanceFormResult,
		ValidationErrors
	} from './types';
	import { goto } from '$app/navigation';
	import { page, session } from '$app/stores';
	import { getContext } from 'svelte';
	import { enhance } from './enhance';

	const actionData = getContext<Writable<ActionData>>('svemix-form');

	$: console.log($actionData);

	export let action: string = '';
	export let method: string = 'POST';

	export let validate: (input?: { data?: FormData }) => ValidationErrors = () => ({});
	export let pending: EnhanceFormPending = () => {};
	export let error: EnhanceFormFormError = () => {};
	export let result: EnhanceFormResult = () => {};

	let className: string = '';

	let magicUrl = '';

	$: magicUrl = action.length > 0 ? action : $page.url.pathname;
	$: method = method !== 'POST' && method !== 'GET' ? 'POST' : method;
	$: __session = $session;

	let submitting: boolean = false;
	let errors: ValidationErrors = $actionData?.errors || {};

	$: console.log(errors);
</script>

<form
	action={magicUrl}
	{method}
	use:enhance={{
		validate: ({ data }) => {
			const validationErrors = validate({ data });
			errors = validationErrors;
			return validationErrors;
		},
		pending: ({ data, form }) => {
			submitting = true;
			pending({ data, form });
		},
		formError: ({ data, form, error: form_error, response }) => {
			submitting = false;
			error({ data, form, error: form_error, response });
		},
		errors: ({ errors: validation_errors }) => {
			submitting = false;
			errors = validation_errors;
		},
		result: ({ data, form, response }) => {
			submitting = false;
			// @ts-ignore We ignore it here becuause it exists
			if (response?.session && response.session.status === 'should-update') {
				// @ts-ignore
				$session = response.session.data;
			}
			if (response.errors) {
				errors = response.errors;
			}
			if (response.redirect && response.redirect.length > 0) {
				goto(response.redirect);
			}
			result({ data, form, response });
		}
	}}
	class={className}
	{...$$restProps}
>
	<fieldset class={className} disabled={submitting} aria-disabled={submitting}>
		<slot {submitting} {errors} values={$actionData?.values || {}} />
	</fieldset>
</form>

<style>
	fieldset {
		margin: 0;
		padding: 0;
	}
</style>
