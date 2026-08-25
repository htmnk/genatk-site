import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { repoRoot, readJson } from './shared.mjs';

const live = process.argv.includes('--live');
const reportRoot = resolve(repoRoot, 'marketing/reports');
const [director, sources, automation] = await Promise.all([
  JSON.parse(await readFile(resolve(reportRoot, 'research-director-latest.json'), 'utf8')),
  readJson('marketing/research/source-register.json'),
  readJson('marketing/policies/automation.json'),
]);

const prompt = `You are a research analyst for GenATK, an unreleased toolkit.

Summarize the evidence packets below for a human editor. Keep every source URL.
For each packet, recommend exactly one of: RESEARCH_BRIEF_REVIEW_REQUIRED,
HOLD_FOR_SEARCH_DATA, or REJECT_OR_MONITOR. Explain the evidence gap in one
short paragraph. Do not invent keyword volume, search results, product facts,
or citations. Do not write an article, call to action, roadmap, implementation
detail, code, or private file path. Do not recommend publishing anything.

Research director report:
${JSON.stringify(director, null, 2)}

Approved technical-source register:
${JSON.stringify(sources, null, 2)}

Return Markdown only.`;

let output;
let mode = 'fixture';
if (live) {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is required for --live. The default fixture mode makes no external request.');
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: automation.researchModel, input: prompt, store: false }),
  });
  if (!response.ok) throw new Error(`OpenAI research request failed: ${response.status} ${await response.text()}`);
  output = (await response.json()).output_text;
  mode = 'live';
} else {
  output = await readFile(resolve(repoRoot, 'marketing/fixtures/mock-research-synthesis.md'), 'utf8');
}
if (!output?.trim()) throw new Error('Research synthesis was empty.');
await mkdir(reportRoot, { recursive: true });
await writeFile(resolve(reportRoot, 'research-synthesis-latest.md'), `<!-- mode: ${mode}; untrusted research artifact; not publishable -->\n\n${output.trim()}\n`);
console.log(`Wrote ${mode} research synthesis artifact.`);
