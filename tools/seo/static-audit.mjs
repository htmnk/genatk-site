import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { siteRoot } from './shared.mjs';

const dist = resolve(siteRoot, 'dist');
const errors = [];
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => entry.isDirectory() ? walk(resolve(directory, entry.name)) : [resolve(directory, entry.name)]))).flat();
}
const files = await walk(dist);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${file}: missing title.`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) errors.push(`${file}: missing meta description.`);
  if (!/<link rel="canonical" href="[^"]+"/.test(html)) errors.push(`${file}: missing canonical.`);
  if (!/<h1(?:\s[^>]*)?>/.test(html)) errors.push(`${file}: missing H1.`);
}
const robots = await readFile(resolve(dist, 'robots.txt'), 'utf8').catch(() => '');
if (!/Sitemap:\s+\/sitemap-index\.xml/.test(robots)) errors.push('dist/robots.txt: missing sitemap declaration.');
await readFile(resolve(dist, 'sitemap-index.xml'), 'utf8').catch(() => errors.push('dist/sitemap-index.xml: missing sitemap.'));
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else console.log(`Static SEO audit passed (${htmlFiles.length} page(s)).`);

