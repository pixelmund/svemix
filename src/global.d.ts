/// <reference types="@sveltejs/kit" />

interface SessionData {
	views: number;
}

// See https://kit.svelte.dev/docs#typescript
// for information about these interfaces
declare namespace App {
	interface Locals {
		session: import('../dist/session').Session<SessionData>;
	}

	interface Platform {}

	interface Session extends SessionData {}

	interface Stuff {}
}
