import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { repoRoot } from './shared.mjs';

const evidenceRoot = resolve(repoRoot, 'marketing/public-evidence');
const output = resolve(repoRoot, 'marketing/reports/content-context.json');
const files = (await readdir(evidenceRoot)).filter((name) => name.endsWith('.json'));
const context = Object.fromEntries(await Promise.all(files.map(async (name) => [name, JSON.parse(await readFile(resolve(evidenceRoot, name), 'utf8'))])));
await writeFile(output, `${JSON.stringify(context, null, 2)}\n`);
console.log(`Wrote sanitized content context: ${output}`);

