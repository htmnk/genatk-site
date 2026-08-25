import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { contentRoot, parseFrontmatter, readJson } from './shared.mjs';

const ledger = await readJson('marketing/content-ledger.json');
const evidence = await readJson('marketing/public-evidence/claims.json');
const evidenceIds = new Set(evidence.filter((claim) => claim.status === 'approved').map((claim) => claim.id));
const policy = await readJson('marketing/policies/disclosure.json');
const errors = [];
const intents = new Map();
for (const entry of ledger) {
  if (!entry.primaryIntent || !entry.targetQuery) errors.push(`Ledger entry ${entry.slug}: primaryIntent and targetQuery are required.`);
  const existing = intents.get(entry.primaryIntent?.toLowerCase());
  if (existing) errors.push(`Ledger entry ${entry.slug}: primary intent duplicates ${existing}.`);
  intents.set(entry.primaryIntent?.toLowerCase(), entry.slug);
}
const titles = new Map();
for (const collection of await readdir(contentRoot)) {
  const root = resolve(contentRoot, collection);
  for (const name of await readdir(root)) {
    if (!name.endsWith('.md')) continue;
    const file = resolve(root, name);
    const { attributes, body, error } = parseFrontmatter(await readFile(file, 'utf8'));
    if (error) errors.push(`${file}: ${error}`);
    for (const key of ['title', 'description', 'audience', 'intent', 'primaryIntent', 'evidenceIds', 'cta', 'status']) if (!attributes[key]) errors.push(`${file}: missing ${key}.`);
    if (attributes.title) {
      const previous = titles.get(attributes.title.toLowerCase());
      if (previous) errors.push(`${file}: title duplicates ${previous}.`);
      titles.set(attributes.title.toLowerCase(), file);
    }
    if (attributes.evidenceIds) for (const id of attributes.evidenceIds.replace(/^\[|\]$/g, '').split(',').map((value) => value.trim())) if (!evidenceIds.has(id)) errors.push(`${file}: evidence ID ${id} is not approved.`);
    if (body.trim().split(/\s+/).length < 250 && attributes.status === 'published') errors.push(`${file}: published content must contain at least 250 words.`);
    if (attributes.status === 'published') for (const key of policy.requiredPublishedFields) if (!attributes[key]) errors.push(`${file}: published content is missing ${key}.`);
    if (attributes.status === 'published' && policy.requiredEvidence && attributes.evidenceIds) {
      const ids = attributes.evidenceIds.replace(/^\[|\]$/g, '').split(',').map((value) => value.trim());
      const hasOriginalArtifact = evidence.some((claim) => ids.includes(claim.id) && claim.specificity === 'original-study');
      if (!hasOriginalArtifact) errors.push(`${file}: published content needs an approved original-study evidence artifact.`);
    }
    const slug = name.replace(/\.md$/, '');
    const entry = ledger.find((candidate) => candidate.slug === slug && candidate.collection === collection && candidate.decision === 'create');
    if (!entry) errors.push(`${file}: missing a CREATE entry in marketing/content-ledger.json.`);
    else if (attributes.primaryIntent && attributes.primaryIntent !== entry.primaryIntent) errors.push(`${file}: primaryIntent does not match its ledger entry.`);
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else console.log('Content preflight passed.');
