import type { CookieParseOptions, CookieSerializeOptions } from './types';
export type { CookieParseOptions, CookieSerializeOptions };

export { parse as parseCookies, serialize as makeCookie } from './cookie.js';

export function daysToMaxage(days: number) {
	var today = new Date();
	var resultDate = new Date(today);
	resultDate.setDate(today.getDate() + days);

	return resultDate.getTime() / 1000 - today.getTime() / 1000;
}
