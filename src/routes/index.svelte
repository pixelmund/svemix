<script>
	import { goto } from '$app/navigation';
</script>

<h1>Svemix Integration Tests</h1>

<a href="/layouts">Layouts</a>
<a href="/action">Actions</a>
<a href="/loader/can-error">Loader - Can Error</a>
<a href="/loader/can-redirect">Loader - Can Redirect</a>
<a href="/loader/can-return-data">Loader - Can Return Data</a>
<a href="/metadata">Metadata</a>

<button on:click={() => goto('/metadata')}>Testing $app/navigation</button>

<style>
	a {
		display: block;
		margin-bottom: 1rem;
	}
</style>
