import fs from 'fs';
import path from 'path';
import util from 'util';

const access = util.promisify(fs.access);
const mkdir = util.promisify(fs.mkdir);
const writeToFile = util.promisify(fs.writeFile);

/**
 *
 * @param {string} path
 * @returns {Promise<boolean>}
 */
async function isDirExisting(path) {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}

/**
 *
 * @param {string} filePath
 * @param {any} data
 * @returns {Promise<any>}
 */
export async function writeFile(filePath, data) {
	try {
		const dirname = path.dirname(filePath);
		const exist = await isDirExisting(dirname);

		if (!exist) {
			await mkdir(dirname, { recursive: true });
		}

		await writeToFile(filePath, data, 'utf8');
	} catch (err) {
		console.log(err);
		throw new Error(err);
	}
}

/**
 *
 * @param {*} obj_from_json
 * @returns {string}
 */
export function stringifyObject(obj_from_json) {
	if (typeof obj_from_json !== 'object' || Array.isArray(obj_from_json)) {
		// not an object, stringify using native function
		return JSON.stringify(obj_from_json);
	}
	// Implements recursive object serialization according to JSON spec
	// but without quotes around the keys.
	let props = Object.keys(obj_from_json)
		.map((key) => `${key}:${stringifyObject(obj_from_json[key])}`)
		.join(',');
	return `{${props}}`;
}
