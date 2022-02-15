import fs from 'fs';
import path from 'path';

// We have to remove the svemix folder because svelte-kit package behaves weird otherwise
function preBuildFix() {
	fs.rmSync(path.resolve(process.cwd(), '.svelte-kit', 'svemix'), { recursive: true, force: true });
}

preBuildFix();
