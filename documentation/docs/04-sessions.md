---
title: Sessions
---

Svemix provides you with ⚒️ encrypted "stateless" cookie sessions, how this works is create a session to be stored in the browser cookies via a encrypted seal. The seal stored on the client contains the session data, not your server, making it a "stateless" session from the server point of view. This is a different take than `express-session` where the cookie contains a session ID to then be used to map data on the server-side.

Svemix has adopted [svelte-kit-cookie-session](https://github.com/pixelmund/svelte-kit-cookie-session) (which is also developed by me) with some tweaks and modifications / optimizations.

### Usage

> The secret is a private key or list of private keys you must pass at runtime, it should be at least `32 characters` long. Use [Password Generator](https://1password.com/password-generator/) to generate strong secrets.


```ts
/// file: hooks.ts or hooks/index.ts
// @errors: 2339 2304
import type { GetSession } from '@sveltejs/kit';
import { handleSession } from 'svemix/session';

export const getSession: GetSession = ({ locals }) => {
	return locals.session.data;
};

export const handle = handleSession(
	{
		// This should come from an secret environment variable and never be exposed on github.
		secret: process.env['COOKIE_SECRET'] as string,
		// Pass the getSession function, default uses all data inside locals.session.data
		getSession
	},
	// Optional own handle function can be passed here
	function ({ event, resolve }) {
		// event.locals is populated with the session `event.locals.session` and `event.locals.cookies`;
		const response = resolve(event);

		return response;
	}
);
```

### Secret rotation is supported.

It allows you to change the secret used to sign and encrypt sessions while still being able to decrypt sessions that were created with a previous secret.

This is useful if you want to:

- rotate secrets for better security every two (or more, or less) weeks
- change the secret you previously used because it leaked somewhere (😱)

Then you can use multiple secrets:

**Week 1**:

```js
// @errors: 2339 2304
export const handle = handleSession({
	secret: 'SOME_COMPLEX_SECRET_AT_LEAST_32_CHARS'
});
```

**Week 2**:

```js
// @errors: 2339 2304
export const handle = handleSession({
	secret: [
		{
			id: 2,
			secret: 'SOME_OTHER_COMPLEX_SECRET_AT_LEAST_32_CHARS'
		},
		{
			id: 1,
			secret: 'SOME_COMPLEX_SECRET_AT_LEAST_32_CHARS'
		}
	]
});
```

Notes:

- `id` is required so that we do not have to try every secret in the list when decrypting (the `id` is part of the cookies value).
- The secret used to encrypt session data is always the first one in the array, so when rotating to put a new secret, it must be first in the array list
- Even if you do not provide an array at first, you can always move to array based secret afterwards, knowing that your first password (`string`) was given `{id:1}` automatically.


### Session is reactive to actions / writes

If you're updating or destroying the session inside one of your `actions`, the `Form` Component automatically updates the client store as well. This is really helpful because typically the session would only be set on a full page reload / server side rendering.


### Setting The Session


If the session already exists, the data get's updated but the expiration time stays the same

The only way to set the session is setting the locals.session.data to an object

```svelte
/// file: src/routes/auth/login.svelte
<script context="module" lang="ts" ssr>
	import { redirect } from 'svemix/server';
	import { authenticateUser } from '$lib/auth';
	import type { Action } from 'svemix';
	import type { User } from '@prisma/client';

	interface ActionData {
		email?: string;
		password?: string;
	}

	export const action: Action<ActionData> = async function ({ request }) {
		// @ts-ignore
		const body = await request.formData();

		const email = body.get('email');
		const password = body.get('password');

		try {
			const { user, errors } = await authenticateUser(email, password);

			if (errors.email || errors.password) {
				return {
					values: {
						email,
						password
					},
					errors
				};
			}

			locals.session.data = { isLoggedIn: true, user };

			return redirect('/', 302);
		} catch (error) {
			return {
				values: {
					email,
					password
				},
				formError: error.message
			};
		}
	};
</script>
```


### Accessing The Session


After initializing the session, your locals will be filled with a session JS Proxy, this Proxy automatically sets the cookie if you set the locals.session.data to something and receive the current data via locals.session.data only. To see this in action add a console.log(locals.session) it will be empty. Only if you add an console.log(locals.session.data) and access the data it will output the current data. So if you wonder why is my session not filled, this is why.

```svelte
/// file: src/routes/auth/login.svelte
<script context="module" lang="ts" ssr>
	import type { Loader } from 'svemix';
	import { redirect } from 'svemix/server';

	export const loader: Loader<any> = function ({ locals }) {
		// Redirect the user to an different page
		// The loader runs everytime the session stores updates with one of your actions
		// This results in no need to full page reloads.
		if (locals.session.data?.isLoggedIn) {
			return redirect('/', 302);
		}

		return {};
	};
</script>
```


### Destroying the Session


```svelte
/// file: src/routes/index.svelte
<script context="module" lang="ts" ssr>
	import type { Action } from 'svemix';

	export const action: Action<any, any, Locals> = async function ({ locals, request }) {
		// @ts-ignore
		const body = await request.formData();

		const _action = body.get('_action');

		if (_action === 'logout') {
			locals.session.destroy();
		}

		return {};
	};
</script>

<script lang="ts">
	import { session } from '$app/stores';
	import { Form } from 'svemix';
</script>

{#if $session.isLoggedIn}
	<Form>
		<input type="hidden" name="_action" value="logout" />
		<button type="submit">Logout</button>
	</Form>
{:else}
	<a href="/auth/login"> Sign in </a>
{/if}
```


### Typescript

To define global types for your session you can edit your app.d.ts and add something like this:

```ts
// app.d.ts
interface SessionData {
	views: number;
}

// See https://kit.svelte.dev/docs#typescript
// for information about these interfaces
declare namespace App {
	interface Locals {
		session: import('svemix/session').Session<SessionData>;
		cookies: Record<string, string>;
	}

	interface Platform {}

	interface Session extends SessionData {}

	interface Stuff {}
}
```