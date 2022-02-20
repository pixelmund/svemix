<script>
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';

	export let closeSidebar;
	export let contents = [];

	let path = null;

	/** @type {HTMLElement} */
	let content;

	/** @type {NodeListOf<HTMLElement>} */
	let headings;

	/** @type {number[]} */
	let positions = [];

	onMount(async () => {
		await document.fonts.ready;

		update();
		highlight();
	});

	afterNavigate(() => {
		update();
		highlight();
	});

	function update() {
		content = document.querySelector('.content');
		const { top } = content.getBoundingClientRect();

		// don't update `selected` for headings above level 4, see _sections.js
		headings = content.querySelectorAll('[id]:not([data-scrollignore])');

		positions = Array.from(headings).map((heading) => {
			return heading.getBoundingClientRect().top - top;
		});
	}

	function highlight() {
		const { top } = content.getBoundingClientRect();

		let i = headings.length;

		while (i--) {
			if (positions[i] + top < 40) {
				const heading = headings[i];
				path = `${$page.url.pathname}#${heading.id}`;
				return;
			}
		}

		path = $page.url.pathname;
	}
</script>

<svelte:window on:scroll={highlight} on:resize={update} />

<ul>
	{#each contents as section}
		<li class="mb-2">
			<a class="section " sveltekit:prefetch href={section.path} on:click={closeSidebar}>
				<h3
					class="mb-2 font-black text-white {$page.url.pathname === section.path
						? 'border-l-2 border-gray-100'
						: ''} pl-4 -ml-2"
				>
					{section.title}
				</h3>
			</a>
			{#if $page.url.pathname === section.path}
				<ul>
					{#each section.sections as subsection}
						<li>
							<a
								class="subsection"
								sveltekit:prefetch
								class:active={subsection.path === path}
								href={subsection.path}
								on:click={closeSidebar}
							>
								<h4
									class="pl-4 mb-1 {subsection.path === path ? 'text-purple-300' : 'text-gray-200'}"
								>
									{subsection.title}
								</h4>
							</a>
							<ul>
								{#each subsection.sections as subsection}
									<li>
										<a
											class="nested subsection"
											class:active={subsection.path === path}
											href={subsection.path}
											on:click={closeSidebar}
											sveltekit:prefetch
										>
											<h5
												class="pl-8 mb-1 font-semibold text-gray-200 {subsection.path === path
													? 'text-sky-400'
													: 'text-gray-200'}"
											>
												{subsection.title}
											</h5>
										</a>
									</li>
								{/each}
							</ul>
						</li>
					{/each}
				</ul>
			{/if}
		</li>
	{/each}
</ul>
