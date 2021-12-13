# Vite Plugin Svemix

### Installation

```sh
 npm install svemix
 npm install -D vite-plugin-svemix
```

```js
/// svelte.config.js
...
import svemix from 'vite-plugin-svemix';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// ...
	kit: {
		// ...
		vite: {
			plugins: [svemix({})],
			/// ...
		}
	}
};

export default config;

```