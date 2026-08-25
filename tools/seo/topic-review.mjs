import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { repoRoot, readJson } from './shared.mjs';

const ledger = await readJson('marketing/content-ledger.json');
const approvedEvidence = new Set((await readJson('marketing/public-evidence/claims.json'))
  .filter((claim) => claim.status === 'approved')
  .map((claim) => claim.id));
const recommendations = ledger.map((entry) => {
  const evidenceReady = entry.uniqueEvidence.every((id) => approvedEvidence.has(id));
  const action = entry.decision !== 'create' ? 'REJECT' : evidenceReady ? 'BRIEF_OR_DRAFT' : 'HOLD_FOR_EVIDENCE';
  return { slug: entry.slug, collection: entry.collection, action, evidenceReady, reason: action === 'BRIEF_OR_DRAFT' ? 'A unique, approved evidence basis exists.' : 'Do not create content without approved evidence.' };
});
const report = { generatedAt: new Date().toISOString(), recommendations };
const reportRoot = resolve(repoRoot, 'marketing/reports');
await mkdir(reportRoot, { recursive: true });
await writeFile(resolve(reportRoot, 'topic-review.json'), `${JSON.stringify(report, null, 2)}\n`);
for (const recommendation of recommendations) console.log(`${recommendation.action}: ${recommendation.slug} — ${recommendation.reason}`);

