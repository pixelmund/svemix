<script context="module">
	import { writable } from 'svelte/store';
	const formState = writable({
		loading: false,
		data: {},
		errors: {},
		redirect: '',
		formError: ''
	});
</script>

<script>
	import { createEventDispatcher } from 'svelte';
	import { page, session } from '$app/stores';
	import { goto } from '$app/navigation';
	const dispatchEvent = createEventDispatcher();
	export let action = '';
	export let method = 'POST';
	export let validate = (data) => ({});
	let className = '';
	let magicUrl = '';
	let thisForm;
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
	function parseAllQuery(input) {
		return input.reduce((acc, cur) => {
			const [key, value] = cur.split('::');
			acc[key] = value;
			return acc;
		}, {});
	}
	function pageQueryToFormState() {
		const errors = $page.url.searchParams.getAll('errors[]') ?? [];
		const data = $page.url.searchParams.getAll('data[]') ?? [];
		const formError = $page.url.searchParams.get('formError') ?? '';
		formState.update((cur) => ({
			...cur,
			errors: parseAllQuery(errors),
			data: parseAllQuery(data),
			formError
		}));
	}
	$: __session = $session;
	function getFormData() {
		const formData = new FormData(thisForm);
		let output = {};
		formData.forEach((value, key) => {
			// Check if property already exist
			if (Object.prototype.hasOwnProperty.call(output, key)) {
				let current = output[key];
				if (!Array.isArray(current)) {
					// If it's not an array, convert it to an array.
					current = output[key] = [current];
				}
				current.push(value); // Add the new value to the array.
			} else {
				output[key] = value;
			}
		});
		return {
			formData,
			formObject: output
		};
	}
	async function onSubmit() {
		if (typeof window === 'undefined') {
			return;
		}
		const { formData, formObject } = getFormData();
		const validated = validate(formObject);
		if (Object.values(validated).some((value) => value.length > 0)) {
			formState.set({
				loading: false,
				data: formObject,
				errors: validated,
				formError: '',
				redirect: ''
			});
			return;
		}
		formState.set({ loading: true, data: {}, errors: {}, formError: '', redirect: '' });
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
		dispatchEvent('submit', { ...$formState });
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
