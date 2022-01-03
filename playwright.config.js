/** @type {import('@playwright/test').PlaywrightTestConfig} */

export const config = {
	testDir: 'tests',
	timeout: 15000, // needs to be high because the AMP validator takes a stupid about of time to initialise
	webServer: {
		command: 'npm run dev',
		port: 3001,
		timeout: 10000
	},
	workers: 6,
	projects: [
		{
			name: `dev+js`,
			use: {
				javaScriptEnabled: true
			}
		},
		{
			name: `dev-js`,
			use: {
				javaScriptEnabled: false
			}
		}
	]
	// use: {
	// 	screenshot: 'only-on-failure'
	// }
};

export default config;
