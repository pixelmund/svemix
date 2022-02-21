<script>
	export let prev = { title: '', slug: '' };
	export let next = { title: '', slug: '' };
</script>

<div class="flex my-12 items-center justify-between">
	{#if prev && prev.slug.length > 0}
		<a class="!text-gray-200 !no-underline hover:!text-white flex items-center text-base sm:text-xl font-semibold" href={prev.slug} sveltekit:prefetch>
			<svg
				class="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-1 sm:mr-2"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M15 19l-7-7 7-7"
				/></svg
			>
			{prev.title}
		</a>
	{:else}
		<span />
	{/if}

	{#if next && next.slug.length > 0}
		<a
			class="!text-gray-200 !no-underline hover:!text-white flex items-center text-base sm:text-xl font-semibold"
			href={next.slug}
			sveltekit:prefetch
		>
			{next.title}
			<svg
				class="w-4 h-4 inline-block ml-1 sm:ml-2"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 5l7 7-7 7"
				/></svg
			>
		</a>
	{/if}
</div>
