---
title: Configuration
---

> Svemix let's you configure some things like the default SEO / Meta Data. There will probably be more configurable things in the future.

### Example

```js
/// file: svelte.config.js

/** @type {import('svemix').SvemixConfig} */
const config = {
	//...
	svemix: {
		seo: {
			title: '',
			description: '',
			keywords: '',
			openGraph: {
				title: '',
				description: ''
				// etc.
			},
			twitter: {
				site: '',
				title: ''
			}
			// etc.
		}
	},
};

export default config;
```
