import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { repoRoot } from './shared.mjs';

const mode = process.env.GSC_MODE || 'mock';
const root = resolve(repoRoot, 'marketing/reports');
let report;
if (mode === 'mock') {
  const fixture = JSON.parse(await readFile(resolve(repoRoot, 'marketing/fixtures/gsc-search-analytics.json'), 'utf8'));
  const rows = fixture.rows.map((row) => ({ query: row.keys[0], page: row.keys[1], clicks: row.clicks, impressions: row.impressions, ctr: row.ctr, position: row.position }));
  report = { source: 'mock', syncedAt: new Date().toISOString(), rows };
} else if (mode === 'auto' && (!process.env.GSC_CLIENT_ID || !process.env.GSC_CLIENT_SECRET || !process.env.GSC_REFRESH_TOKEN)) {
  report = { source: 'unconfigured', syncedAt: new Date().toISOString(), rows: [], reason: 'Missing read-only OAuth credentials.' };
} else if (mode === 'live' || mode === 'auto') {
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GSC_CLIENT_ID,
      client_secret: process.env.GSC_CLIENT_SECRET,
      refresh_token: process.env.GSC_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  if (!tokenResponse.ok) throw new Error(`GSC OAuth refresh failed: ${tokenResponse.status} ${await tokenResponse.text()}`);
  const { access_token: accessToken } = await tokenResponse.json();
  const now = new Date();
  const end = new Date(now.getTime() - 3 * 86_400_000).toISOString().slice(0, 10);
  const start = new Date(now.getTime() - 31 * 86_400_000).toISOString().slice(0, 10);
  const property = process.env.GSC_PROPERTY || 'sc-domain:genatk.com';
  const searchResponse = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ startDate: start, endDate: end, dimensions: ['query', 'page'], type: 'web', dataState: 'final', rowLimit: 25_000 }),
  });
  if (!searchResponse.ok) throw new Error(`GSC Search Analytics request failed: ${searchResponse.status} ${await searchResponse.text()}`);
  const data = await searchResponse.json();
  const rows = (data.rows || []).map((row) => ({ query: row.keys[0], page: row.keys[1], clicks: row.clicks, impressions: row.impressions, ctr: row.ctr, position: row.position }));
  report = { source: 'google-search-console', syncedAt: new Date().toISOString(), property, startDate: start, endDate: end, rows };
} else {
  throw new Error(`Unsupported GSC_MODE: ${mode}`);
}
await mkdir(root, { recursive: true });
await writeFile(resolve(root, 'gsc-latest.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Synced ${report.rows.length} Search Console row(s) from ${report.source}.`);
