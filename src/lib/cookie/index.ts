import type { CookieParseOptions, CookieSerializeOptions } from './types';
export type { CookieParseOptions, CookieSerializeOptions };

export { parse as parseCookies, serialize as makeCookie } from './cookie.js';

export function daysToMaxage(days: number) {
	let today = new Date();
	let resultDate = new Date(today);
	resultDate.setDate(today.getDate() + days);
	return resultDate.getTime() / 1000 - today.getTime() / 1000;
}
