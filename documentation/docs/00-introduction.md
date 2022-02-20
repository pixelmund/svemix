---
title: Introduction
---

### Before we begin

> Svemix is in early development, and some things may change before we hit version 1.0. This document is a work-in-progress. If you get stuck, reach out for help in the [discussions tab](https://github.com/svemix/svemix/discussions) or [open an issue](https://github.com/svemix/svemix/issues).

### What is Svemix?

Svemix is a somewhat different framework than you're probably used to. It can be seen as an full-stack addition to Svelte(SvelteKit). Svemix provides you with server scripts inside your Svelte components/routes, which will be transformed into endpoints. Loader functions and actions similar to remix, improved developer experience, SEO handling, cookies, easy to use forms, sessions and much more to come in the future.

### How does it work?

Svemix Vite-Plugin replaces all code inside `<script context="module" ssr>` and generates the corresponding [SvelteKit-Endpoint](https://kit.svelte.dev/docs/routing#endpoints) next to the file for you, this means for `src/routes/todos.svelte` it will generate `src/routes/todos.{js|ts}`. SvelteKit will then make sure to run your loader on the server and for client side navigations it fetches the data required by the page.
- This enables us to import a database or any other stuff that should never reach the client directly inside your Svelte Routes.

### Getting started

The easiest way to start building a Svemix app is to run `npm init svelte@next <dir>`:

```bash
npm init svelte@next my-app
cd my-app
npm install
npm install svemix
npm run dev
```

If you already have an existing SvelteKit project setup, that's fine you can just use `npm install svemix`.

Once you have the required dependency installed, you should add `svemix/plugin` inside your `svelte.config.js` file under `vite.plugins`

```js
/// file: svelte.config.js
import svemix from 'svemix/plugin';

/** @type {import('svemix').SvemixConfig} */
const config = {
	// ...
	kit: {
		// ...
		vite: {
			plugins: [svemix()]
			/// ...
		}
	},
	svemix: {
		// ...
	}
};

export default config;
```
