import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { repoRoot, readJson } from './shared.mjs';

const args = process.argv.slice(2);
const option = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};
const slug = option('--slug');
const live = args.includes('--live');
if (!slug) throw new Error('Usage: node tools/seo/draft.mjs --slug <ledger-slug> [--live]');

const [ledger, claims, disclosure, automation] = await Promise.all([
  readJson('marketing/content-ledger.json'),
  readJson('marketing/public-evidence/claims.json'),
  readJson('marketing/policies/disclosure.json'),
  readJson('marketing/policies/automation.json'),
]);
const entry = ledger.find((candidate) => candidate.slug === slug);
if (!entry || entry.decision !== 'create' || entry.disclosureRisk !== 'safe') throw new Error(`${slug} is not approved for drafting.`);
const evidence = claims.filter((claim) => entry.uniqueEvidence.includes(claim.id) && claim.status === 'approved');
if (evidence.length !== entry.uniqueEvidence.length) throw new Error(`${slug} has unapproved evidence.`);
const briefPath = resolve(repoRoot, 'marketing/briefs', `${slug}.md`);
const brief = await readFile(briefPath, 'utf8');
const prompt = `Write a useful, technically literate Markdown article body for the stated audience.\n\nBrief:\n${brief}\n\nApproved evidence (do not invent beyond it):\n${JSON.stringify(evidence, null, 2)}\n\nRules: Explain only general principles. Do not include code, product internals, roadmaps, competitor claims, unsupported numbers, or calls to buy. Include clear H2 sections. Return only the article body in Markdown.`;
let body;
let mode = 'mock';
if (live) {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is required for --live. Use the default mock mode until a key is configured.');
  mode = 'live';
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: automation.draftModel, input: prompt, store: false }),
  });
  if (!response.ok) throw new Error(`OpenAI draft request failed: ${response.status} ${await response.text()}`);
  body = (await response.json()).output_text;
} else {
  body = await readFile(resolve(repoRoot, 'marketing/fixtures/mock-draft-body.md'), 'utf8');
}
if (!body?.trim()) throw new Error('Draft response was empty.');
const violations = [
  ...disclosure.forbiddenTerms.filter((term) => body.toLowerCase().includes(term.toLowerCase())).map((term) => `forbidden term “${term}”`),
  ...disclosure.forbiddenPatterns.filter((raw) => new RegExp(raw, 'i').test(body)).map((raw) => `forbidden pattern ${raw}`),
];
if (violations.length) throw new Error(`Draft rejected by disclosure gate: ${violations.join(', ')}`);
const outputRoot = resolve(repoRoot, 'marketing/drafts');
await mkdir(outputRoot, { recursive: true });
const output = resolve(outputRoot, `${slug}.md`);
const header = `---\nslug: ${slug}\ncollection: ${entry.collection}\nmode: ${mode}\nstatus: untrusted-draft\nevidenceIds: [${entry.uniqueEvidence.join(', ')}]\n---\n\n`;
await writeFile(output, `${header}${body.trim()}\n`);
console.log(`Wrote ${mode} draft artifact: ${output}`);

