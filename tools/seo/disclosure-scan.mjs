import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { contentRoot, readJson } from './shared.mjs';

const policy = await readJson('marketing/policies/disclosure.json');
const files = [];
for (const collection of await readdir(contentRoot)) {
  const collectionRoot = resolve(contentRoot, collection);
  for (const name of await readdir(collectionRoot)) if (name.endsWith('.md')) files.push(resolve(collectionRoot, name));
}
const violations = [];
for (const file of files) {
  const source = await readFile(file, 'utf8');
  for (const term of policy.forbiddenTerms) if (source.toLowerCase().includes(term.toLowerCase())) violations.push(`${file}: forbidden term “${term}”`);
  for (const raw of policy.forbiddenPatterns) if (new RegExp(raw, 'i').test(source)) violations.push(`${file}: forbidden pattern ${raw}`);
}
if (violations.length) {
  console.error(violations.join('\n'));
  process.exitCode = 1;
} else console.log(`Disclosure scan passed (${files.length} content file(s)).`);

