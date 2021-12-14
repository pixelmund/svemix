import { tc } from "../../utils.js";

/**
 * @param {import('../../../').SvemixConfig['seoDefaults']} defaults
 * @returns {string}
 */
const svelteHead = (defaults) => `
<svelte:head>
<title>{_metadata?.title || '${defaults?.title ?? ""}'}</title>
<meta name="description" content="{_metadata?.description || '${
     defaults?.description ?? ""
   }'}">
{#if _metadata?.canonical}
  <link rel="canonical" href={_metadata?.canonical}/>
{/if}
{#if _metadata?.keywords}
 <meta name="keywords" content={_metadata?.keywords || '${defaults?.keywords ?? ""}'} />
{/if}

{#if _metadata?.openGraph}

   {#if _metadata?.openGraph.title}
       <meta property="og:title" content={_metadata?.openGraph.title} />
   {/if}

   {#if _metadata?.openGraph.description}
     <meta property="og:description" content={_metadata?.openGraph.description} />
   {/if}

   {#if _metadata?.openGraph.url || _metadata?.canonical}
     <meta property="og:url" content={_metadata?.openGraph.url || _metadata?.canonical} />
   {/if}

   {#if _metadata?.openGraph.type}
     <meta property="og:type" content={_metadata?.openGraph.type.toLowerCase()} />
   {/if}

   {#if _metadata?.openGraph.article}
     {#if _metadata?.openGraph.article.publishedTime}
       <meta
         property="article:published_time"
         content={_metadata?.openGraph.article.publishedTime} />
     {/if}

     {#if _metadata?.openGraph.article.modifiedTime}
       <meta
         property="article:modified_time"
         content={_metadata?.openGraph.article.modifiedTime} />
     {/if}

     {#if _metadata?.openGraph.article.expirationTime}
       <meta
         property="article:expiration_time"
         content={_metadata?.openGraph.article.expirationTime} />
     {/if}

     {#if _metadata?.openGraph.article.section}
       <meta property="article:section" content={_metadata?.openGraph.article.section} />
     {/if}

     {#if _metadata?.openGraph.article.authors && _metadata?.openGraph.article.authors.length}
       {#each _metadata?.openGraph.article.authors as author}
         <meta property="article:author" content={author} />
       {/each}
     {/if}

     {#if _metadata?.openGraph.article.tags && _metadata?.openGraph.article.tags.length}
       {#each _metadata?.openGraph.article.tags as tag}
         <meta property="article:tag" content={tag} />
       {/each}
     {/if}
   {/if}

   {#if _metadata?.openGraph.images && _metadata?.openGraph.images.length}
     {#each _metadata?.openGraph.images as image}
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

{#if _metadata?.twitter}
  <meta name="twitter:card" content="summary_large_image" />
  {#if _metadata.twitter.site}
    <meta
      name="twitter:site"
      content={_metadata.twitter.site}
    />
  {/if}
  {#if _metadata.twitter.title}
    <meta
      name="twitter:title"
      content={_metadata.twitter.title}
    />
  {/if}
  {#if _metadata.twitter.description}
    <meta
      name="twitter:description"
      content={_metadata.twitter.description}
    />
  {/if}
  {#if _metadata.twitter.image}
    <meta
      name="twitter:image"
      content={_metadata.twitter.image}
    />
  {/if}
  {#if _metadata.twitter.imageAlt}
    <meta
      name="twitter:image:alt"
      content={_metadata.twitter.imageAlt}
    />
  {/if}
 {/if}

</svelte:head>
`;

/** @type {import('./types').Transformer} */
export default function InstanceTransformer(args) {
  let { doc, config } = args;

  const instanceContent = `
    <script ${tc(doc.scripts.instance?.attrs?.lang === "ts", 'lang="ts"')}>
        ${doc.scripts.instance?.content || ""}
        export let _metadata;
    </script>
    ${svelteHead(config.seoDefaults)}
  `;

  return instanceContent;
}
