<script context="module">
	export const prerender = true;
</script>

<div class="h-screen w-full flex flex-col flex-1">
	<header class="max-w-6xl mx-auto w-full px-6 py-9 flex justify-between items-center text-white ">
		<a aria-label="Svemix" aria-current="page" class="active" href="/">
			<img class="h-8 w-auto" src="/svemix_logo.png" alt="Svemix" />
		</a>
		<nav class="flex" aria-label="Main">
			<a
				sveltekit:prefetch
				class="text-d-p-sm mx-2 sm:mx-4 last:mr-0 opacity-80 hover:opacity-100 font-semibold "
				href="/docs/getting-started/installation">Docs</a
			>
			<a
				rel="external"
				target="_blank"
				class="text-d-p-sm mx-2 sm:mx-4 last:mr-0 opacity-80 hover:opacity-100 font-semibold hidden sm:block"
				href="https://github.com/svemix/svemix">GitHub</a
			>
		</nav>
	</header>
	<div class="max-w-6xl mx-auto w-full mt-20 px-6">
		<h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-7xl tracking-tight font-black">
			The <span class="text-yellow-300">Full-Stack</span> addition to
			<span class="text-red-400">SvelteKit.</span>
			Write your <span class="text-violet-300">server code</span> inside
			<span class="text-red-200">.svelte</span>
			files, handle <span class="text-teal-400">sessions, forms and SEO easily.</span>
		</h1>
		<div class="flex pt-20 max-w-xl items-center space-x-3">
			<a
				sveltekit:prefetch
				class="w-1/2 py-4 border-2 text-center font-semibold tracking-tight text-lg"
				href="/docs/getting-started/installation">Read the docs</a
			>
			<a
				target="_blank"
				rel="external"
				class="py-4 px-4 border-2 text-center font-semibold tracking-tight text-lg flex items-center justify-center text-violet-300 border-violet-300"
				href="https://github.com/svemix/svemix"
			>
				<svg viewBox="0 0 16 16" width="28" height="28" fill="currentColor" aria-hidden="true">
					<path
						d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
					/>
				</svg>
			</a>
		</div>
	</div>
</div>
