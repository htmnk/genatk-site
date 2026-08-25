import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { repoRoot } from './shared.mjs';

const mode = process.env.ANALYTICS_MODE || 'mock';
if (mode !== 'mock') throw new Error('Live analytics sync is intentionally disabled until a read-only analytics credential and property are configured. See docs/integrations.md.');
const fixture = JSON.parse(await readFile(resolve(repoRoot, 'marketing/fixtures/analytics-events.json'), 'utf8'));
const root = resolve(repoRoot, 'marketing/reports');
await mkdir(root, { recursive: true });
await writeFile(resolve(root, 'analytics-latest.json'), `${JSON.stringify({ ...fixture, syncedAt: new Date().toISOString() }, null, 2)}\n`);
console.log(`Synced ${fixture.events.length} mock analytics event(s).`);

