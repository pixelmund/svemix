<script context="module">
	export const prerender = true;

	// TODO should use a shadow endpoint instead, need to fix a bug first
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ fetch, params }) {
		const res = await fetch(`/docs/${params.slug}.json`);

		if (!res.ok) {
			return {
				status: res.status,
				error: await res.text()
			};
		}

		const { prev, next, section } = await res.json();

		return {
			props: {
				prev,
				next,
				section
			}
		};
	}
</script>

<script>
	import * as hovers from '$lib/client/hovers.js';
	import '$lib/client/docs.css';
	import '$lib/client/shiki.css';
	import PostBottomNavigation from '$lib/PostBottomNavigation.svelte';

	export let prev;
	export let next;
	export let section;

	hovers.setup();
</script>

<svelte:head>
	<title>{section.title} • Docs • Svemix</title>

	<meta name="twitter:title" content="Svemix docs" />
	<meta name="twitter:description" content="{section.title} • Svemix documentation" />
	<meta name="description" content="{section.title} • Svemix documentation" />
</svelte:head>

<div class="content listify">
	<h1>{section.title}</h1>

	<a
		class="flex items-center font-semibold mt-4"
		href="https://github.com/svemix/svemix/edit/main/documentation/{section.file}"
	>
		<svg
			class="mr-2 w-4 h-4"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
			<path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
		</svg>
		Edit this page on GitHub
	</a>

	<section class="pt-6">
		{@html section.content}
	</section>

	<div class="controls">
		<PostBottomNavigation {prev} {next} />
	</div>
</div>
