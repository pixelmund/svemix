// @ts-nocheck
import filesystem from 'fs';

const _readDirSync = filesystem.readdirSync;
const _statSync = filesystem.statSync;

filesystem.statSync = function (path, options) {
	if (!path.includes('routes')) return _statSync(path, options);
	try {
		const result = _statSync(path, options);
		return result;
	} catch (error) {
		return {
			isDirectory: () => false
		};
	}
};

filesystem.readdirSync = function (path, options) {
	if (!path.includes('routes')) return _readDirSync(path, options);
	const result = _readDirSync(path, options);
	const newResult = [
		...new Set(
			result
				.map((entry) => {
					if (entry.includes('__error') || entry.includes('__layout')) return entry;
					if (!entry.includes('.svelte')) return entry;
					return [entry, entry.replace('.svelte', '.ts')];
				})
				.flat()
		)
	];
	return newResult;
};

Object.defineProperty(globalThis, 'fs', {
	configurable: true,
	enumerable: true,
	value: filesystem
});

