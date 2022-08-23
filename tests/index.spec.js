import { expect } from '@playwright/test';
import { test } from './utils.js';

test.describe('Loader', () => {
	test('can return data', async ({ page }) => {
		await page.goto('/loader/can-return-data');
		expect(await page.innerHTML('h1')).toBe('Svemix');
		expect(await page.innerHTML('h2')).toBe('25');
		expect(await page.innerHTML('h3')).toBe('Github');
	});

	test('can return error', async ({ page }) => {
		await page.goto('/loader/can-error');
		expect(await page.innerHTML('h1')).toBe('My Custom Error');
	});

	test('can redirect', async ({ page }) => {
		await page.goto('/loader/can-redirect');
		expect(await page.innerHTML('h1')).toBe('REDIRECT WORKED');
	});
});

test.describe('Metadata', () => {
	test('can set attributes', async ({ page }) => {
		await page.goto('/metadata');
		expect(await page.title()).toBe('Custom Title');
	});
	test('respects defaults', async ({ page }) => {
		await page.goto('/metadata');
		await page.waitForTimeout(1000);
		const metaDescriptionValue = await page.$eval('meta[name="description"]', (el) => el.content);
		expect(metaDescriptionValue).toBe('Default description');
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

	test.skip('handles errors correctly', async ({ page }) => {
		await page.goto('/action');
		await page.click('#submit-2');

		expect(await page.innerHTML('#error-val-2')).toBe('ERROR');
	});

	test.skip('restores form state if js disabled', async ({ page, javaScriptEnabled }) => {
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

	// Flaky test, disabled for now
	// test('loading state / loading spinner', async ({ page, javaScriptEnabled }) => {
	// 	if (javaScriptEnabled) {
	// 		await page.goto('/action');
	// 		const loader = page.locator('#loader');
	// 		await page.click('#submit-4', { force: true });
	// 		await loader.waitFor({ state: 'attached' });
	// 		expect(await loader.innerHTML()).toBe('LOADING...');
	// 	}
	// });
});

const getCookieValue = (cookie) => cookie.split(';')[0].trim();

test.skip('Session', () => {
	test('should be set correctly', async ({ request }) => {
		const response = await request.get('/session.json');
		const set_cookie = response.headers()['set-cookie'];
		expect(set_cookie).toBeDefined();
		expect(set_cookie).toContain('svemix.testing');

		const data = await response.json();
		const views = data.session.views;
		expect(views).toBe(1);

		const response1 = await request.get('/session.json', {
			headers: { Cookie: getCookieValue(set_cookie) }
		});
		const set_cookie_1 = response1.headers()['set-cookie'];
		expect(set_cookie_1).toBeDefined();
		expect(set_cookie_1).toContain('svemix.testing');

		const data1 = await response1.json();
		const views1 = data1.session.views;
		expect(views1).toBe(2);
	});

	test('should be destroyed correctly', async ({ request }) => {
		const response = await request.get('/session.json');
		const set_cookie = response.headers()['set-cookie'];
		expect(set_cookie).toBeDefined();
		expect(set_cookie).toContain('svemix.testing');

		const data = await response.json();
		const views = data.session.views;
		expect(views).toBe(1);

		const response1 = await request.delete('/session.json', {
			headers: { Cookie: getCookieValue(set_cookie) }
		});
		const set_cookie_1 = response1.headers()['set-cookie'];
		expect(set_cookie_1).toBeDefined();
		expect(set_cookie_1).toContain('svemix.testing=0');

		const data1 = await response1.json();
		const deleted = data1.deleted;
		const session = data1.session;
		expect(deleted).toBe(true);
		expect(session).toBeFalsy();
	});

	test('should keep the expiration date if already exists', async ({ request, page }) => {
		const response = await request.get('/session.json');
		const initial_set_cookie = response.headers()['set-cookie'];

		const initial_data = await response.json();

		await page.waitForTimeout(750);

		const after_response = await request.get('/session.json', {
			headers: { Cookie: getCookieValue(initial_set_cookie) }
		});
		const after_data = await after_response.json();
		const after_set_cookie = after_response.headers()['set-cookie'];

		const initialExpires = new Date(initial_data.session.expires).getTime();
		const afterExpires = new Date(after_data.session.expires).getTime();

		expect(afterExpires).toBeGreaterThanOrEqual(initialExpires - 2000);
		expect(afterExpires).toBeLessThan(initialExpires + 2000);

		const oldMaxAge = initial_set_cookie.split(';')[1].trim().replace('Max-Age=', '');
		const newMaxAge = after_set_cookie.split(';')[1].trim().replace('Max-Age=', '');

		expect(parseInt(newMaxAge, 10)).toBeLessThanOrEqual(parseInt(oldMaxAge, 10));
	});
});
