import { writable } from 'svelte/store';
let formId = 1;
export function createForm() {
	const currentId = formId;
	const formState = writable({
		id: currentId,
		loading: false,
		data: {},
		errors: {},
		redirect: '',
		formError: ''
	});
	formId += 1;
	return formState;
}
export function getFormData(form) {
	const formData = new FormData(form);
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
export function parseQuery(input) {
	return input.reduce((acc, cur) => {
		const [key, value] = cur.split('::');
		acc[key] = value;
		return acc;
	}, {});
}
