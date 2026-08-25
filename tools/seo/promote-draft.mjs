import { access, readFile, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';
import { contentRoot, repoRoot, readJson } from './shared.mjs';

const args = process.argv.slice(2);
const slug = args[args.indexOf('--slug') + 1];
if (!slug || !args.includes('--apply')) throw new Error('Usage: node tools/seo/promote-draft.mjs --slug <slug> --apply');
const reviewPath = resolve(repoRoot, 'marketing/reviews', `${slug}.json`);
let review;
try {
  review = JSON.parse(await readFile(reviewPath, 'utf8'));
} catch (error) {
  if (error.code === 'ENOENT') throw new Error(`Missing human approval at ${reviewPath}. Copy review.example.json, replace its placeholders, and set approved to true.`);
  throw error;
}
if (review.slug !== slug || review.approved !== true) throw new Error(`${reviewPath} must explicitly approve this slug.`);
for (const key of ['reviewedBy', 'reviewedAt', 'author', 'authorUrl', 'howCreated', 'title', 'description']) if (!review[key] || review[key].startsWith?.('Replace')) throw new Error(`${reviewPath}: missing a real ${key}.`);
const entry = (await readJson('marketing/content-ledger.json')).find((candidate) => candidate.slug === slug && candidate.decision === 'create');
if (!entry) throw new Error(`${slug} has no approved CREATE ledger entry.`);
const draft = await readFile(resolve(repoRoot, 'marketing/drafts', `${slug}.md`), 'utf8');
const body = draft.replace(/^---\n[\s\S]*?\n---\n\n/, '');
const output = resolve(contentRoot, entry.collection, `${slug}.md`);
try {
  await access(output, constants.F_OK);
  throw new Error(`${output} already exists; promotion refuses to overwrite content.`);
} catch (error) {
  if (!String(error.message).includes('already exists') && error.code !== 'ENOENT') throw error;
  if (String(error.message).includes('already exists')) throw error;
}
const frontmatter = `---\ntitle: ${JSON.stringify(review.title)}\ndescription: ${JSON.stringify(review.description)}\npublishedAt: ${review.reviewedAt}\nreviewedAt: ${review.reviewedAt}\naudience: ${entry.audience}\nintent: ${entry.intent}\nprimaryIntent: ${JSON.stringify(entry.primaryIntent)}\nevidenceIds: [${entry.uniqueEvidence.join(', ')}]\nauthor: ${JSON.stringify(review.author)}\nauthorUrl: ${review.authorUrl}\nhowCreated: ${JSON.stringify(review.howCreated)}\ncta: waitlist\nstatus: published\n---\n\n`;
await writeFile(output, `${frontmatter}${body.trim()}\n`);
console.log(`Promoted reviewed draft to ${output}`);
