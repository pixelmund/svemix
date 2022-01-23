import fs from 'fs';
import path from 'path';
import util from 'util';

const access = util.promisify(fs.access);
const mkdir = util.promisify(fs.mkdir);
const writeToFile = util.promisify(fs.writeFile);

export const SVEMIX_LIB_DIR = () => (process.env.TEST == 'true' ? '$lib' : 'svemix');

/**
 *
 * @param {boolean} condition
 * @param {string} str
 * @returns {string}
 */
export const tc = (condition, str) => (condition ? str : '');

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
 * @param {string} str
 * @returns {string}
 */
export function posixify(str) {
	return str.replace(/\\/g, '/');
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

