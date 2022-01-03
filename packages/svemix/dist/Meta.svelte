<script>
	export let _metadata = {};
	export let _defaults = {};
	$: metadata = {
		..._defaults,
		..._metadata
	};
</script>

<svelte:head>
	{#if metadata}
		{#if metadata?.title}
			<title>
				{metadata.title}
			</title>
		{/if}
		{#if metadata?.description}
			<meta name="description" content={metadata.description} />
		{/if}
		{#if metadata?.canonical}
			<link rel="canonical" href={metadata.canonical} />
		{/if}
		{#if metadata?.keywords}
			<meta name="keywords" content={metadata.keywords} />
		{/if}
		{#if metadata?.openGraph}
			{#if metadata.openGraph?.title}
				<meta property="og:title" content={metadata.openGraph.title} />
			{/if}
			{#if metadata.openGraph?.description}
				<meta property="og:description" content={metadata.openGraph.description} />
			{/if}
			{#if metadata.openGraph?.url || metadata.canonical}
				<meta property="og:url" content={metadata.openGraph?.url || metadata?.canonical} />
			{/if}
			{#if metadata.openGraph?.type}
				<meta property="og:type" content={metadata.openGraph.type.toLowerCase()} />
			{/if}
			{#if metadata.openGraph.article}
				{#if metadata.openGraph.article?.publishedTime}
					<meta
						property="article:published_time"
						content={metadata.openGraph.article.publishedTime}
					/>
				{/if}
				{#if metadata.openGraph.article?.modifiedTime}
					<meta
						property="article:modified_time"
						content={metadata.openGraph.article.modifiedTime}
					/>
				{/if}
				{#if metadata.openGraph.article?.expirationTime}
					<meta
						property="article:expiration_time"
						content={metadata.openGraph.article.expirationTime}
					/>
				{/if}
				{#if metadata.openGraph.article?.section}
					<meta property="article:section" content={metadata.openGraph.article.section} />
				{/if}
				{#if metadata.openGraph.article?.authors && metadata.openGraph.article.authors.length}
					{#each metadata.openGraph.article.authors as author}
						<meta property="article:author" content={author} />
					{/each}
				{/if}
				{#if metadata.openGraph.article?.tags && metadata.openGraph.article.tags.length}
					{#each metadata.openGraph.article.tags as tag}
						<meta property="article:tag" content={tag} />
					{/each}
				{/if}
			{/if}
			{#if metadata.openGraph?.images && metadata.openGraph.images.length}
				{#each metadata.openGraph.images as image}
					<meta property="og:image" content={image.url} />
					{#if image.alt}
						<meta property="og:image:alt" content={image.alt} />
					{/if}
					{#if image.width}
						<meta property="og:image:width" content={image.width.toString()} />
					{/if}
					{#if image.height}
						<meta property="og:image:height" content={image.height.toString()} />
					{/if}
				{/each}
			{/if}
		{/if}
		{#if metadata?.twitter}
			<meta name="twitter:card" content="summary_large_image" />
			{#if metadata.twitter?.site}
				<meta name="twitter:site" content={metadata.twitter.site} />
			{/if}
			{#if metadata.twitter?.title}
				<meta name="twitter:title" content={metadata.twitter.title} />
			{/if}
			{#if metadata.twitter?.description}
				<meta name="twitter:description" content={metadata.twitter.description} />
			{/if}
			{#if metadata.twitter?.image}
				<meta name="twitter:image" content={metadata.twitter.image} />
			{/if}
			{#if metadata.twitter?.imageAlt}
				<meta name="twitter:image:alt" content={metadata.twitter.imageAlt} />
			{/if}
		{/if}
	{/if}
</svelte:head>
