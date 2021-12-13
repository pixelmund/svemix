# Svemix-Preprocessor

### Installation

```sh
 npm install @svemix/svemix
 npm install -D @svemix/preprocess
```

```js
/// svelte.config.js
...
import svemix from '@svemix/preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess({
			postcss: true
		}),
		svemix()
	],
};

export default config;

```