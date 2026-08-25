import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { repoRoot, readJson } from './shared.mjs';

const ledger = await readJson('marketing/content-ledger.json');
const approvedEvidence = new Set((await readJson('marketing/public-evidence/claims.json'))
  .filter((claim) => claim.status === 'approved')
  .map((claim) => claim.id));
const recommendations = ledger.map((entry) => {
  const evidenceReady = entry.uniqueEvidence.every((id) => approvedEvidence.has(id));
  const artifactReady = entry.status === 'ready-for-editorial-review';
  const action = entry.decision !== 'create'
    ? 'REJECT'
    : !evidenceReady
      ? 'HOLD_FOR_EVIDENCE'
      : !artifactReady
        ? 'HOLD_FOR_PUBLIC_ARTIFACT'
        : 'BRIEF_OR_DRAFT';
  const reason = action === 'BRIEF_OR_DRAFT'
    ? 'A unique, approved evidence basis and reviewed public artifact exist.'
    : action === 'HOLD_FOR_PUBLIC_ARTIFACT'
      ? 'Approved claims exist, but the required public artifact has not passed review.'
      : 'Do not create content without approved evidence.';
  return { slug: entry.slug, collection: entry.collection, action, evidenceReady, artifactReady, reason };
});
const report = { generatedAt: new Date().toISOString(), recommendations };
const reportRoot = resolve(repoRoot, 'marketing/reports');
await mkdir(reportRoot, { recursive: true });
await writeFile(resolve(reportRoot, 'topic-review.json'), `${JSON.stringify(report, null, 2)}\n`);
for (const recommendation of recommendations) console.log(`${recommendation.action}: ${recommendation.slug} — ${recommendation.reason}`);
