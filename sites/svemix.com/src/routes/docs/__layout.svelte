<script context="module">
	export const prerender = true;

	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ fetch }) {
		const res = await fetch('/docs.json');

		if (!res.ok) {
			return {
				status: res.status,
				error: await res.text()
			};
		}

		return {
			props: {
				sections: await res.json()
			}
		};
	}
</script>

<script>
	import Contents from '$lib/Contents.svelte';

	let sidebarOpen = false;

	export let sections;

	$: contents = sections.map((section) => ({
		path: `/docs/${section.slug}`,
		title: section.title,
		sections: section.sections.map((subsection) => ({
			path: `/docs/${section.slug}#${subsection.slug}`,
			title: subsection.title,
			sections: subsection.sections.map((subsection) => ({
				path: `/docs/${section.slug}#${subsection.slug}`,
				title: subsection.title
			}))
		}))
	}));
</script>

<div
	class="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-gray-900/10"
>
	<div class="max-w-[90rem] mx-auto">
		<div class="py-4 border-b border-gray-900/10 lg:px-8 lg:border-0 mx-4 lg:mx-0">
			<div class="relative flex items-center">
				<a class="mr-3 flex-none overflow-hidden md:w-auto" href="/">
					<img class="h-6 md:h-8 w-auto" src="/svemix_logo.png" alt="Svemix" />
				</a>
				<nav class="hidden lg:block ml-auto">
					<ul class="flex space-x-8 text-sm leading-6 font-semibold text-gray-200">
						<li>
							<a
								rel="external"
								target="_blank"
								href="https://github.com/svemix/svemix"
								class="block w-6 h-6 text-gray-200 hover:text-gray-100"
								><span class="sr-only">Svemix on GitHub</span>
								<svg
									viewBox="0 0 16 16"
									width="24"
									height="24"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
									/>
								</svg>
							</a>
						</li>
					</ul>
				</nav>
				<a
					rel="external"
					target="_blank"
					href="https://github.com/svemix/svemix"
					class="ml-auto text-gray-300 w-8 h-8 -my-1 flex items-center justify-center hover:text-gray-100 lg:hidden"
					><span class="sr-only">Svemix on Github</span>
					<svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor" aria-hidden="true">
						<path
							d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
						/>
					</svg>
				</a>
				<div class="ml-3 -my-1 lg:hidden">
					<button
						on:click={() => (sidebarOpen = !sidebarOpen)}
						type="button"
						class="text-gray-300 w-8 h-8 flex items-center justify-center hover:text-gray-100"
					>
						<span class="sr-only">Navigation</span>
						<svg
							class="w-8 h-8"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16m-7 6h7"
							/></svg
						>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="overflow-hidden">
	<div class="max-w-[90rem] mx-auto px-4 sm:px-6 md:px-8">
		<div
			class="{sidebarOpen
				? 'translate-x-0'
				: '-translate-x-[19.5rem]'} lg:translate-x-0 transition-transform duration-200 block fixed z-20 inset-0 top-[3.8125rem] left-[max(0px,calc(50%-45rem))] right-auto w-[19.5rem] py-10 px-8 overflow-y-auto"
		>
			<nav id="nav" class="lg:text-sm lg:leading-6">
				<Contents {contents} closeSidebar={() => (sidebarOpen = false)} />
			</nav>
		</div>
		<div
			class="{sidebarOpen
				? 'translate-x-[19.5rem]'
				: 'translate-x-0'} lg:pl-[19.5rem] min-w-[calc(100vw-19.5rem)] lg:min-w-0 transition-all duration-200"
		>
			<div class="markdown max-w-3xl mx-auto relative z-20 pt-10 xl:max-w-none">
				<slot />
			</div>
		</div>
	</div>
</div>
