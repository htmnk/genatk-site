import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { repoRoot, readJson, queryOverlap } from './shared.mjs';

const [seeds, ledger, claims] = await Promise.all([
  readJson('marketing/research/seeds.json'),
  readJson('marketing/content-ledger.json'),
  readJson('marketing/public-evidence/claims.json'),
]);
const approved = new Set(claims.filter((claim) => claim.status === 'approved').map((claim) => claim.id));
const candidates = seeds.map((seed) => {
  const owned = ledger.find((entry) => queryOverlap(entry.targetQuery, seed.topic) >= 0.7);
  const evidenceReady = approved.has(seed.evidenceRequired);
  return {
    ...seed,
    decision: owned ? 'IMPROVE_EXISTING_OR_REJECT' : evidenceReady ? 'CANDIDATE_FOR_BRIEF' : 'REJECT',
    reason: owned ? `Existing ledger entry ${owned.slug} owns this query intent.` : evidenceReady ? 'Approved evidence exists; a human may decide whether to brief it.' : 'No approved evidence exists.',
  };
});
const root = resolve(repoRoot, 'marketing/reports');
await mkdir(root, { recursive: true });
await writeFile(resolve(root, 'research-report.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), source: 'local-seeds', candidates }, null, 2)}\n`);
for (const candidate of candidates) console.log(`${candidate.decision}: ${candidate.topic} — ${candidate.reason}`);
