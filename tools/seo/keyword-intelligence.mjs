import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { repoRoot, readJson, queryOverlap, queryTokens } from './shared.mjs';

const reportRoot = resolve(repoRoot, 'marketing/reports');
const policy = await readJson('marketing/policies/keyword-intelligence.json');

async function optionalJson(name, fallback) {
  try {
    return JSON.parse(await readFile(resolve(reportRoot, name), 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw error;
  }
}

function normalisePhrase(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9+.# ]/g, ' ').replace(/\s+/g, ' ').trim();
}

function isExcluded(phrase) {
  const tokens = queryTokens(phrase);
  return policy.excludedTerms.some((term) => tokens.has(term));
}

function candidateCluster(phrase) {
  return policy.seedClusters
    .map((cluster) => ({ cluster, overlap: Math.max(...cluster.seeds.map((seed) => queryOverlap(phrase, seed))) }))
    .sort((left, right) => right.overlap - left.overlap)[0];
}

function generatedCandidates() {
  return policy.seedClusters.flatMap((cluster) => cluster.seeds.flatMap((seed) => [
    { phrase: seed, origin: 'policy-seed', cluster },
    ...cluster.modifiers.map((modifier) => ({ phrase: `${seed} ${modifier}`, origin: 'policy-expansion', cluster })),
  ]));
}

const [gsc, importedDemand, fixtureDemand] = await Promise.all([
  optionalJson('gsc-latest.json', { source: 'unavailable', rows: [] }),
  optionalJson('keyword-demand-latest.json', null),
  readJson('marketing/fixtures/keyword-demand.json'),
]);
const demand = importedDemand || fixtureDemand;
const demandRows = Array.isArray(demand.rows) ? demand.rows : [];
const gscRows = Array.isArray(gsc.rows) ? gsc.rows : [];
const entries = new Map();

for (const generated of generatedCandidates()) {
  const phrase = normalisePhrase(generated.phrase);
  if (phrase && !isExcluded(phrase)) entries.set(phrase, { phrase, origin: [generated.origin], clusterId: generated.cluster.id, audienceJob: generated.cluster.audienceJob, evidence: [] });
}
for (const row of demandRows) {
  const phrase = normalisePhrase(row.keyword || row.query);
  const found = candidateCluster(phrase);
  if (!phrase || isExcluded(phrase) || !found || found.overlap < .2) continue;
  const entry = entries.get(phrase) || { phrase, origin: ['demand-source'], clusterId: found.cluster.id, audienceJob: found.cluster.audienceJob, evidence: [] };
  entry.evidence.push({ type: 'external-demand', source: demand.source, monthlySearches: Number(row.monthlySearches || 0), competition: row.competition || 'unknown', sourceUrl: row.sourceUrl || null });
  entries.set(phrase, entry);
}
for (const row of gscRows) {
  const phrase = normalisePhrase(row.query);
  const found = candidateCluster(phrase);
  if (!phrase || isExcluded(phrase) || !found || found.overlap < .2) continue;
  const entry = entries.get(phrase) || { phrase, origin: ['search-console'], clusterId: found.cluster.id, audienceJob: found.cluster.audienceJob, evidence: [] };
  entry.evidence.push({ type: 'site-impression', source: gsc.source, impressions: Number(row.impressions || 0), clicks: Number(row.clicks || 0), position: Number(row.position || 0), page: row.page || null });
  entries.set(phrase, entry);
}

const candidates = [...entries.values()].map((entry) => {
  const external = entry.evidence.filter((item) => item.type === 'external-demand');
  const site = entry.evidence.filter((item) => item.type === 'site-impression');
  const monthlySearches = external.reduce((sum, item) => sum + item.monthlySearches, 0);
  const impressions = site.reduce((sum, item) => sum + item.impressions, 0);
  const clicks = site.reduce((sum, item) => sum + item.clicks, 0);
  const hasMeasuredDemand = external.some((item) => item.source !== 'fixture' && item.monthlySearches > 0) || site.some((item) => item.source === 'google-search-console' && item.impressions > 0);
  const score = Math.min(Math.log10(monthlySearches + 1) * 3, 12) + Math.min(impressions / 10, 8) + Math.min(clicks, 5) + (hasMeasuredDemand ? 1 : 0);
  const decision = hasMeasuredDemand && score >= policy.minimumScoreForResearch
    ? 'RESEARCH_BRIEF_REVIEW_REQUIRED'
    : 'HOLD_FOR_DEMAND_DATA';
  return { ...entry, monthlySearches, impressions, clicks, score: Number(score.toFixed(2)), decision, rationale: hasMeasuredDemand ? 'A permitted source observed demand. Human review must still assess intent, competition, and evidence quality.' : 'This is a relevant hypothesis, not a validated keyword opportunity. Wait for Bing, Keyword Planner, or GenATK Search Console evidence.' };
}).sort((left, right) => right.score - left.score || left.phrase.localeCompare(right.phrase)).slice(0, policy.maximumCandidates);

const report = { generatedAt: new Date().toISOString(), policy: { targetLocale: policy.targetLocale, minimumScoreForResearch: policy.minimumScoreForResearch }, inputs: { gscSource: gsc.source, demandSource: demand.source, demandImported: Boolean(importedDemand) }, candidates, guardrails: policy.guardrails };
await mkdir(reportRoot, { recursive: true });
await writeFile(resolve(reportRoot, 'keyword-intelligence-latest.json'), `${JSON.stringify(report, null, 2)}\n`);
if (process.env.GITHUB_STEP_SUMMARY) {
  await appendFile(process.env.GITHUB_STEP_SUMMARY, [
    '## GenATK keyword intelligence', '',
    `- Demand source: **${demand.source}**`, `- Search Console: **${gsc.source}**`, '',
    '| Phrase | Decision | Score | Measured monthly searches | GSC impressions |', '| --- | --- | ---: | ---: | ---: |',
    ...candidates.slice(0, 12).map((item) => `| ${item.phrase} | ${item.decision} | ${item.score} | ${item.monthlySearches} | ${item.impressions} |`), '',
    'Hypotheses without permitted demand data remain on hold. This report cannot publish content.', '',
  ].join('\n'));
}
console.log(`Keyword intelligence: ${candidates.length} candidates; demand=${demand.source}; GSC=${gsc.source}.`);
