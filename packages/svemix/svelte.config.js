import preprocess from 'svelte-preprocess';
import svemix from './build/plugin/index.js';

/** @type {import('./build').SvemixConfig} */
const config = {
	preprocess: [preprocess()],
	svemix: {
		seo: {
			title: 'Override me',
			openGraph: {
				title: 'OpenGraph Title'
			},
			description: 'Default description',
			keywords: 'tests,stuff,cool,svemix'
		}
	},
	kit: {
		package: {
			dir: 'build',
			exports: (filepath) => {
				const splitted_path = filepath.split('/');
				if (filepath.endsWith('.d.ts')) return false;
				if (splitted_path.length > 2) return false;
				if (filepath.includes('index')) return true;
				return false;
			}
		},
		target: '#svelte',
		vite: {
			plugins: [svemix()]
		}
	}
};

export default config;
