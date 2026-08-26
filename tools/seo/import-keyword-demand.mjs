import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, extname, resolve } from 'node:path';
import { repoRoot } from './shared.mjs';

const args = process.argv.slice(2);
const sourceIndex = args.indexOf('--source');
const fileIndex = args.indexOf('--file');
const countryIndex = args.indexOf('--country');
const languageIndex = args.indexOf('--language');
const source = sourceIndex >= 0 ? args[sourceIndex + 1] : '';
const input = fileIndex >= 0 ? args[fileIndex + 1] : '';
const country = countryIndex >= 0 ? args[countryIndex + 1] : null;
const language = languageIndex >= 0 ? args[languageIndex + 1] : null;
if (!source || !input || !['bing-webmaster-tools', 'google-keyword-planner'].includes(source)) {
  throw new Error('Usage: npm run seo:keyword-import -- --source bing-webmaster-tools|google-keyword-planner --file /absolute/path/to/normalised.json|planner-export.csv [--country US] [--language en]');
}

function numberValue(value) {
  const normalized = String(value || '').replace(/[^0-9.]/g, '');
  return normalized ? Number(normalized) : 0;
}

function plannerCsvRows(buffer) {
  const utf16 = buffer.subarray(0, 64).includes(0);
  const text = buffer.toString(utf16 ? 'utf16le' : 'utf8').replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/).filter(Boolean);
  const headerIndex = lines.findIndex((line) => line.startsWith('Keyword\t'));
  if (headerIndex < 0) throw new Error('The CSV does not look like a Google Keyword Planner export: expected a tab-separated Keyword header.');
  const header = lines[headerIndex].split('\t');
  const keywordIndex = header.indexOf('Keyword');
  const volumeIndex = header.indexOf('Avg. monthly searches');
  const competitionIndex = header.indexOf('Competition');
  if (keywordIndex < 0 || volumeIndex < 0) throw new Error('The CSV is missing Keyword or Avg. monthly searches columns.');
  return lines.slice(headerIndex + 1).map((line) => {
    const columns = line.split('\t');
    return {
      keyword: String(columns[keywordIndex] || '').trim(),
      monthlySearches: numberValue(columns[volumeIndex]),
      competition: String(columns[competitionIndex] || 'unknown').trim() || 'unknown',
      sourceUrl: null,
    };
  }).filter((row) => row.keyword);
}

const extension = extname(input).toLowerCase();
let rows;
if (extension === '.csv') {
  if (source !== 'google-keyword-planner') throw new Error('CSV import is currently supported only for Google Keyword Planner exports. Use normalized JSON for Bing exports.');
  rows = plannerCsvRows(await readFile(input));
} else {
  const parsed = JSON.parse(await readFile(input, 'utf8'));
  if (!Array.isArray(parsed.rows)) throw new Error('Input JSON must have a rows array. Each row needs keyword and optional monthlySearches, competition, and sourceUrl.');
  rows = parsed.rows.map((row) => ({ keyword: String(row.keyword || '').trim(), monthlySearches: Number(row.monthlySearches || 0), competition: row.competition || 'unknown', sourceUrl: row.sourceUrl || null })).filter((row) => row.keyword);
}
const report = { source, capturedAt: new Date().toISOString(), importedFrom: basename(input), market: { country, language }, rows };
const reportRoot = resolve(repoRoot, 'marketing/reports');
const marketSlug = [country || 'global', language || 'any'].join('-').toLowerCase().replace(/[^a-z0-9-]+/g, '-');
await mkdir(reportRoot, { recursive: true });
await writeFile(resolve(reportRoot, 'keyword-demand-latest.json'), `${JSON.stringify(report, null, 2)}\n`);
await writeFile(resolve(reportRoot, `keyword-demand-${marketSlug}.json`), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Imported ${rows.length} keyword-demand row(s) from ${source} for ${marketSlug}. These local reports are gitignored and never publish content.`);
