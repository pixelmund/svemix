<script lang="ts">
	import { createEventDispatcher, setContext } from 'svelte';
	import { page, session } from '$app/stores';
	import { goto } from '$app/navigation';
	import { createForm, getFormData } from './utils/form_helper';
	import type { ActionData } from './server';

	const dispatchEvent = createEventDispatcher();

	export let actionData: ActionData;
	export let action: string = '';
	export let method: string = 'POST';

	type ValidatorFunction = (data: Record<any, any>) => Record<string, string>;
	export let validate: ValidatorFunction = (data) => ({});

	$: formState = createForm(actionData);

	let className: string = '';

	let magicUrl = '';
	let thisForm: HTMLFormElement;

	$: magicUrl = action.length > 0 ? action : $page.url.pathname;
	$: method = method !== 'POST' && method !== 'GET' ? 'POST' : method;
	$: __session = $session;

	setContext('svemix-form', formState);

	async function onSubmit() {
		const { formData, formObject } = getFormData(thisForm);

		const validated = validate(formObject);

		if (Object.values(validated).some((value) => value.length > 0)) {
			formState.update((state) => ({
				id: state.id,
				loading: false,
				data: formObject,
				errors: validated,
				formError: '',
				redirect: ''
			}));
			return;
		}

		formState.update((state) => ({
			id: state.id,
			loading: true,
			data: formObject,
			errors: {},
			formError: '',
			redirect: ''
		}));

		dispatchEvent('submitting', { ...$formState });

		const response = await fetch(magicUrl, {
			method,
			credentials: 'include',
			body: formData,
			headers: {
				accept: 'application/json'
			}
		});

		if (!response.ok) {
			const formError = await response.text();
			formState.update((state) => ({ ...state, loading: false, formError }));
			return;
		}

		const data = await response.json();

		const actionData = data.actionData;
		const session = data.session;

		// Update the client session with the current data, but only if it was changed.
		if (session?.status === 'should-update') {
			session.set(session?.data);
		}

		formState.update((state) => ({
			...state,
			loading: false,
			formError: actionData?.formError,
			errors: actionData?.errors || {},
			redirect: actionData?.redirect || '',
			data: actionData?.data || {}
		}));

		dispatchEvent('submitted', { ...$formState });

		if (actionData?.redirect) {
			goto(actionData?.redirect);
			return;
		}
	}

	$: formStateProps = $formState;

	export { className as class };
</script>

<form
	action={magicUrl}
	{method}
	on:submit|preventDefault={onSubmit}
	bind:this={thisForm}
	class={className}
	{...$$restProps}
>
	<fieldset
		class={className}
		disabled={formStateProps.loading}
		aria-disabled={formStateProps.loading}
	>
		<slot
			loading={formStateProps.loading}
			errors={formStateProps.errors}
			data={formStateProps.data}
			formError={formStateProps.formError}
		/>
	</fieldset>
</form>

<style>
	fieldset {
		margin: 0;
		padding: 0;
	}
</style>
