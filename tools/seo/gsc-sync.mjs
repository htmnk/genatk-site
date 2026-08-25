import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { repoRoot } from './shared.mjs';

const mode = process.env.GSC_MODE || 'mock';
if (mode !== 'mock') throw new Error('Live GSC sync is intentionally disabled until a read-only OAuth credential and verified Search Console property are configured. See docs/integrations.md.');
const fixture = JSON.parse(await readFile(resolve(repoRoot, 'marketing/fixtures/gsc-search-analytics.json'), 'utf8'));
const rows = fixture.rows.map((row) => ({ query: row.keys[0], page: row.keys[1], clicks: row.clicks, impressions: row.impressions, ctr: row.ctr, position: row.position }));
const report = { source: 'mock', syncedAt: new Date().toISOString(), rows };
const root = resolve(repoRoot, 'marketing/reports');
await mkdir(root, { recursive: true });
await writeFile(resolve(root, 'gsc-latest.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Synced ${rows.length} mock Search Console row(s).`);

