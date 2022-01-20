/// <reference types="@sveltejs/kit" />

interface SessionData {
	isLoggedIn: boolean;
}

interface Locals {
	session: import('../dist/session').Session<SessionData>;
}
