<script>
	export let previous = { title: '', href: '' };
	export let next = { title: '', href: '' };
</script>

<div class="flex my-12 items-center justify-between">
	{#if previous && previous.href.length > 0}
		<a class="!text-gray-200 text-xl font-semibold" href={previous.href} sveltekit:prefetch
			>{previous.title}</a
		>
	{:else}
		<span />
	{/if}

	{#if next && next.href.length > 0}
		<a class="!text-gray-200 !no-underline hover:!text-white flex items-center text-xl font-semibold" href={next.href} sveltekit:prefetch>
			{next.title}
			<svg
				class="w-5 h-5 inline-block ml-2"
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
