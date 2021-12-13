<script context="module">
  import { writable } from "svelte/store";

  /** @type {import('svelte/store').Writable<{loading: boolean;
          data: any;
          errors: Record<string, string>;
          formError: string;}>} */
  export const formState = writable({
    loading: false,
    data: {},
    errors: {},
    formError: "",
  });
</script>

<script>
  import { createEventDispatcher } from "svelte";

  const dispatchEvent = createEventDispatcher();

  export let action = "";

  /** @type {HTMLFormElement} */
  let thisForm;

  async function onSubmit() {
    if (typeof window === undefined) {
      return;
    }

    const actionUrl = action.length > 0 ? action : window?.location.pathname;
    const magicUrl = `/$__svemix__` + actionUrl;

    formState.set({ loading: true, data: {}, errors: {}, formError: "" });

    const response = await fetch(magicUrl, {
      method: "POST",
      credentials: "include",
      body: new FormData(thisForm),
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      const formError = await response.text();
      formState.update((state) => ({ ...state, loading: false, formError }));
      return;
    }

    const json = await response.json();

    formState.update((state) => ({
      ...state,
      loading: false,
      errors: json?.errors || {},
      data: json?.data || {},
    }));

    dispatchEvent("submit", { ...$formState });
  }

  $: formStateProps = $formState;
</script>

<form on:submit|preventDefault={onSubmit} bind:this={thisForm} {...$$restProps}>
  <slot
    loading={formStateProps.loading}
    errors={formStateProps.errors}
    data={formStateProps.data}
    formError={formStateProps.formError}
  />
</form>
