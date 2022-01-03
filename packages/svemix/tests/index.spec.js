import { expect } from '@playwright/test';
import { test } from './utils.js';

test.describe('Loader', () => {
	test('Can return props', async ({ page }) => {
		await page.goto('/loader/can-return-props');
		expect(await page.innerHTML('h1')).toBe('Svemix');
		expect(await page.innerHTML('h2')).toBe('25');
		expect(await page.innerHTML('h3')).toBe('Github');
	});

	test('Can redirect', async ({ page }) => {
		await page.goto('/loader/can-redirect');
		expect(await page.innerHTML('h1')).toBe('REDIRECT WORKED');
	});

	test('Can return an error', async ({ page }) => {
		await page.goto('/loader/can-error');
		expect(await page.innerHTML('h1')).toBe('500');
		expect(await page.innerHTML('pre')).toBe('Test');
	});
});

test.describe('Metadata', () => {
	test('Can set attributes', async ({ page }) => {
		await page.goto('/metadata');
		expect(await page.title()).toBe('Custom Title');
	});
	test('Respects defaults', async ({ page }) => {
		await page.goto('/metadata');
		const metaDescriptionValue = await page.$eval('meta[name="description"]', (el) => el.content);
		const metaKeywordsValue = await page.$eval('meta[name="keywords"]', (el) => el.content);
		const openGraphDefaultTitle = await page.$eval('meta[property="og:title"]', (el) => el.content);
		expect(metaDescriptionValue).toBe('Default description');
		expect(metaKeywordsValue).toBe('tests,stuff,cool,svemix');
		expect(openGraphDefaultTitle).toBe('OpenGraph Title');
	});
	test('Overrides defaults correctly', async ({ page }) => {
		await page.goto('/metadata');
		expect(await page.title()).toBe('Custom Title');
	});
});

test.describe('Action', () => {
	test('submits with and without javascript', async ({ page }) => {
		await page.goto('/action');
		await page.click('#submit-1');

		expect(await page.innerHTML('h1')).toBe('submitter-1');
	});

	test('redirects with status code', async ({ page }) => {
		await page.goto('/action');
		await page.click('#submit-1');

		expect(await page.innerHTML('h1')).toBe('submitter-1');
	});
});
