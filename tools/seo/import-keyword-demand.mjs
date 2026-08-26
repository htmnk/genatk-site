import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { repoRoot } from './shared.mjs';

const args = process.argv.slice(2);
const sourceIndex = args.indexOf('--source');
const fileIndex = args.indexOf('--file');
const source = sourceIndex >= 0 ? args[sourceIndex + 1] : '';
const input = fileIndex >= 0 ? args[fileIndex + 1] : '';
if (!source || !input || !['bing-webmaster-tools', 'google-keyword-planner'].includes(source)) {
  throw new Error('Usage: npm run seo:keyword-import -- --source bing-webmaster-tools|google-keyword-planner --file /absolute/path/to/normalised.json');
}
const parsed = JSON.parse(await readFile(input, 'utf8'));
if (!Array.isArray(parsed.rows)) throw new Error('Input must be JSON with a rows array. Each row needs keyword and optional monthlySearches, competition, and sourceUrl.');
const rows = parsed.rows.map((row) => ({ keyword: String(row.keyword || '').trim(), monthlySearches: Number(row.monthlySearches || 0), competition: row.competition || 'unknown', sourceUrl: row.sourceUrl || null })).filter((row) => row.keyword);
const report = { source, capturedAt: new Date().toISOString(), importedFrom: basename(input), rows };
const reportRoot = resolve(repoRoot, 'marketing/reports');
await mkdir(reportRoot, { recursive: true });
await writeFile(resolve(reportRoot, 'keyword-demand-latest.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Imported ${rows.length} keyword-demand row(s) from ${source}. This local report is gitignored and never publishes content.`);
