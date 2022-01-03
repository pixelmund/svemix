import { expect } from '@playwright/test';
import { test } from './utils.js';

test.describe('Loader', () => {
	test('can return props', async ({ page }) => {
		await page.goto('/loader/can-return-props');
		expect(await page.innerHTML('h1')).toBe('Svemix');
		expect(await page.innerHTML('h2')).toBe('25');
		expect(await page.innerHTML('h3')).toBe('Github');
	});

	test('can redirect', async ({ page }) => {
		await page.goto('/loader/can-redirect');
		expect(await page.innerHTML('h1')).toBe('REDIRECT WORKED');
	});

	test('can return an error', async ({ page }) => {
		await page.goto('/loader/can-error');
		expect(await page.innerHTML('h1')).toBe('500');
		expect(await page.innerHTML('pre')).toBe('Test');
	});
});

test.describe('Metadata', () => {
	test('can set attributes', async ({ page }) => {
		await page.goto('/metadata');
		expect(await page.title()).toBe('Custom Title');
	});
	test('respects defaults', async ({ page }) => {
		await page.goto('/metadata');
		const metaDescriptionValue = await page.$eval('meta[name="description"]', (el) => el.content);
		const metaKeywordsValue = await page.$eval('meta[name="keywords"]', (el) => el.content);
		const openGraphDefaultTitle = await page.$eval('meta[property="og:title"]', (el) => el.content);
		expect(metaDescriptionValue).toBe('Default description');
		expect(metaKeywordsValue).toBe('tests,stuff,cool,svemix');
		expect(openGraphDefaultTitle).toBe('OpenGraph Title');
	});
	test('overrides defaults correctly', async ({ page }) => {
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

	test('can redirect', async ({ page }) => {
		await page.goto('/action');
		await page.click('#submit-1');

		expect(await page.innerHTML('h1')).toBe('submitter-1');
	});

	test('handles errors correctly', async ({ page }) => {
		await page.goto('/action');
		await page.click('#submit-2');

		expect(await page.innerHTML('#error-val-2')).toBe('ERROR');
	});

	test('restores form state if js disabled', async ({ page, javaScriptEnabled }) => {
		if (!javaScriptEnabled) {
			await page.goto('/action');

			const inputName = page.locator('#input-name');
			const inputBirth = page.locator('#input-birth');

			const inputNameVal = await inputName.inputValue();
			const inputBirthVal = await inputBirth.inputValue();

			expect(inputNameVal).toBe('');
			expect(inputBirthVal).toBe('');

			await page.fill('#input-name', 'Mike');
			await page.fill('#input-birth', '1995');

			await page.click('#submit-3');

			const inputNameAfterVal = await inputName.inputValue();
			const inputBirthAfterVal = await inputBirth.inputValue();

			expect(inputNameAfterVal).toBe('Mike');
			expect(inputBirthAfterVal).toBe('1995');
		}
	});

	test('loading state / loading spinner', async ({ page, javaScriptEnabled }) => {
		if (javaScriptEnabled) {
			await page.goto('/action');
			const loader = page.locator('#loader');
			await page.click('#submit-4', { force: true });
			await loader.waitFor({ state: 'attached' });
			expect(await loader.innerHTML()).toBe('LOADING...');
		}
	});

	test('session gets automatically updated', async ({ page }) => {
		await page.goto('/action');
		const loggedIn = page.locator('#loggedIn');
		expect(await loggedIn.innerHTML()).toBe('LOGGEDOUT');
		await page.click('#submit-5');
		expect(await loggedIn.innerHTML()).toBe('LOGGEDIN');
	});
});
