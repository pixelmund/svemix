<script lang="ts">
	import type {
		EnhanceFormError,
		EnhanceFormPending,
		EnhanceFormResult,
		ValidationErrors
	} from './types';
	import { goto } from '$app/navigation';
	import { page, session } from '$app/stores';
	import { enhance } from './enhance';
	import { getActionData } from '../context';
	import { mergeObjects } from '../utils';

	const actionData = getActionData();

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

	// @ts-ignore svelte-ignore we subscribe to session to get and set updates
	$: __session = $session;

	let submitting: boolean = false;
	let validationErrors: ValidationErrors = $actionData?.errors || {};

	export { className as class };
</script>

<form
	action={magicUrl}
	{method}
	use:enhance={{
		validate: (data) => {
			const vErrors = validate(data);
			validationErrors = vErrors;
			return validationErrors;
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
					$session = sessionData.data;
				}
			}

			// This updates the actionData stores and deep merges values
			// I don't exactly know if this is the right behaviour
			actionData.update((state) => {
				return mergeObjects(state || {}, data);
			});

			await result({ formData, data, form, response });
		}
	}}
	{...$$restProps}
>
	<fieldset class={className} disabled={submitting} aria-disabled={submitting}>
		<slot data={$actionData} {validationErrors} {submitting} />
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
	}
</style>
