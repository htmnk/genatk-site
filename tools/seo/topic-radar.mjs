import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { repoRoot, readJson, queryTokens } from './shared.mjs';

const mode = process.env.TOPIC_RADAR_MODE || 'fixture';
const policy = await readJson('marketing/policies/topic-radar.json');
const reportRoot = resolve(repoRoot, 'marketing/reports');

function normaliseSignal(signal) {
  return {
    source: signal.source,
    title: String(signal.title || '').trim(),
    url: String(signal.url || '').trim(),
    excerpt: String(signal.excerpt || '').trim(),
    publishedAt: signal.publishedAt || null,
    engagement: Number(signal.engagement || 0),
  };
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'GenATK-topic-radar/0.1 (research only)' },
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`Request failed (${response.status}) for ${url}`);
  return response.json();
}

async function liveSignals() {
  const stackExchange = await fetchJson('https://api.stackexchange.com/2.3/search/advanced?site=gamedev&q=procedural&order=desc&sort=activity&pagesize=100');
  return (stackExchange.items || []).map((item) => normaliseSignal({
      source: 'stackexchange-gamedev',
      title: item.title,
      url: item.link,
      excerpt: 'Developer question found through the Game Development Stack Exchange API.',
      publishedAt: new Date(item.creation_date * 1000).toISOString(),
      engagement: item.score + item.answer_count,
    }));
}

function ageBonus(publishedAt) {
  if (!publishedAt) return 0;
  const ageDays = (Date.now() - new Date(publishedAt).getTime()) / 86_400_000;
  return ageDays <= 30 ? 2 : ageDays <= 180 ? 1 : 0;
}

function candidateFor(signal, watch) {
  const words = queryTokens(`${signal.title} ${signal.excerpt}`);
  const matches = watch.terms.filter((term) => words.has(term)).length;
  const requiredAllMatches = (watch.requiredAll || []).every((term) => words.has(term));
  const requiredAnyMatches = !(watch.requiredAny || []).length || watch.requiredAny.some((term) => words.has(term));
  if (matches < (watch.minimumMatches || 2) || !requiredAllMatches || !requiredAnyMatches || !signal.url || !signal.title) return null;
  const sourceWeight = 4;
  return {
    watchId: watch.id,
    topic: watch.topic,
    score: sourceWeight + matches * 2 + Math.min(signal.engagement, 20) / 10 + ageBonus(signal.publishedAt),
    matchedTerms: watch.terms.filter((term) => words.has(term)),
    signal,
  };
}

const rawSignals = mode === 'live'
  ? await liveSignals()
  : (await readJson('marketing/fixtures/topic-radar.json')).signals.map(normaliseSignal);
const candidates = rawSignals
  .flatMap((signal) => policy.watchlist.map((watch) => candidateFor(signal, watch)).filter(Boolean))
  .sort((left, right) => right.score - left.score)
  .slice(0, policy.maximumCandidates)
  .map((candidate) => ({
    ...candidate,
    recommendation: 'RESEARCH_BRIEF_REVIEW_REQUIRED',
    warning: 'This is a cited discussion signal, not keyword-volume data or permission to create content.',
  }));

const report = {
  source: mode === 'live' ? 'public-api' : 'fixture',
  generatedAt: new Date().toISOString(),
  signalsObserved: rawSignals.length,
  candidates,
  guardrails: policy.guardrails,
};
await mkdir(reportRoot, { recursive: true });
await writeFile(resolve(reportRoot, 'topic-radar-latest.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Topic radar (${report.source}): ${rawSignals.length} signals observed, ${candidates.length} candidate packet(s).`);
for (const candidate of candidates) console.log(`${candidate.topic} — ${candidate.signal.url}`);
