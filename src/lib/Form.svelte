<script lang="ts">
	import { createEventDispatcher, setContext } from 'svelte';
	import { page, session } from '$app/stores';
	import { goto } from '$app/navigation';
	import { createForm, getFormData, parseQuery } from './utils/form_helper';

	const formState = createForm();

	const dispatchEvent = createEventDispatcher();

	export let action: string = '';
	export let method: string = 'POST';

	type ValidatorFunction = (data: Record<any, any>) => Record<string, string>;
	export let validate: ValidatorFunction = (data) => ({});

	let className: string = '';

	let magicUrl = '';
	let thisForm: HTMLFormElement;

	$: if ($page && $page.url.pathname) {
		let actionUrl = action.length > 0 ? action : $page.url.pathname;

		if (actionUrl.endsWith('/')) {
			actionUrl = actionUrl.slice(0, -1);
		}

		magicUrl = `/$__svemix__` + actionUrl;
	}

	$: if (typeof window === 'undefined' && $page.url.search.length > 0) {
		pageQueryToFormState();
	}

	function pageQueryToFormState() {
		const errors = $page.url.searchParams.getAll('errors[]') ?? [];
		const data = $page.url.searchParams.getAll('data[]') ?? [];
		const formError = $page.url.searchParams.get('formError') ?? '';
		formState.update((cur) => ({
			...cur,
			errors: parseQuery(errors),
			data: parseQuery(data),
			formError
		}));
	}

	$: __session = $session;

	setContext('svemix-form', formState);

	async function onSubmit() {
		if (typeof window === 'undefined') {
			return;
		}

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

		const json = await response.json();

		// Update the client session with the current data, but only if it was changed.
		if (json?.session?.status === 'should-update') {
			session.set(json.session?.data);
		}

		formState.update((state) => ({
			...state,
			loading: false,
			formError: json?.formError,
			errors: json?.errors || {},
			redirect: json?.redirect || '',
			data: json?.data || {}
		}));

		dispatchEvent('submitted', { ...$formState });

		if (json?.redirect) {
			goto(json?.redirect);
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
