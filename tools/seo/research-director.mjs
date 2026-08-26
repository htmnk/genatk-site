import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { repoRoot, readJson, queryTokens } from './shared.mjs';

const reportRoot = resolve(repoRoot, 'marketing/reports');
const [policy, radarPolicy, sourceRegister] = await Promise.all([
  readJson('marketing/policies/research-director.json'),
  readJson('marketing/policies/topic-radar.json'),
  readJson('marketing/research/source-register.json'),
]);

async function optionalReport(name, fallback) {
  try {
    return JSON.parse(await readFile(resolve(reportRoot, name), 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw error;
  }
}

const [gsc, radar, keywordIntelligence] = await Promise.all([
  optionalReport('gsc-latest.json', { source: 'unavailable', rows: [] }),
  optionalReport('topic-radar-latest.json', { source: 'unavailable', candidates: [] }),
  optionalReport('keyword-intelligence-latest.json', { candidates: [], inputs: { demandSource: 'unavailable' } }),
]);

function gscRowsFor(watch) {
  return (gsc.rows || []).filter((row) => {
    const tokens = queryTokens(row.query || '');
    const requiredAll = (watch.requiredAll || []).every((term) => tokens.has(term));
    const requiredAny = !(watch.requiredAny || []).length || watch.requiredAny.some((term) => tokens.has(term));
    const matches = watch.terms.filter((term) => tokens.has(term)).length;
    return requiredAll && requiredAny && matches >= (watch.minimumMatches || 2);
  });
}

const packets = radarPolicy.watchlist.map((watch) => {
  const gscRows = gscRowsFor(watch);
  const communitySignals = (radar.candidates || []).filter((candidate) => candidate.watchId === watch.id);
  const technicalSources = sourceRegister.filter((source) => source.watchIds.includes(watch.id));
  const impressions = gscRows.reduce((sum, row) => sum + Number(row.impressions || 0), 0);
  const clicks = gscRows.reduce((sum, row) => sum + Number(row.clicks || 0), 0);
  const communityScore = communitySignals.reduce((sum, candidate) => sum + Number(candidate.score || 0), 0);
  const watchTerms = new Set([...(watch.terms || []), ...(watch.requiredAll || []), ...(watch.requiredAny || [])]);
  const keywordCandidates = (keywordIntelligence.candidates || []).filter((candidate) => {
    const phraseTerms = queryTokens(candidate.phrase || '');
    return [...watchTerms].filter((term) => phraseTerms.has(term)).length >= (watch.minimumMatches || 2);
  });
  const measuredKeywordCandidates = keywordCandidates.filter((candidate) => candidate.decision === 'RESEARCH_BRIEF_REVIEW_REQUIRED');
  const demandScore = measuredKeywordCandidates.reduce((sum, candidate) => sum + Number(candidate.score || 0), 0);
  const score = Math.min(impressions, 50) / 10 + Math.min(clicks, 20) / 5 + Math.min(communityScore, 15) + Math.min(demandScore, 20) + technicalSources.length;
  const hasDemandEvidence = (gsc.source === 'google-search-console' && impressions > 0) || measuredKeywordCandidates.length > 0;
  const recommendation = !hasDemandEvidence
    ? 'HOLD_FOR_DEMAND_DATA'
    : score >= policy.minimumScoreForResearch && technicalSources.length > 0
      ? 'RESEARCH_BRIEF_REVIEW_REQUIRED'
      : 'REJECT_OR_MONITOR';
  return {
    watchId: watch.id,
    topic: watch.topic,
    score: Number(score.toFixed(2)),
    recommendation,
    rationale: recommendation === 'RESEARCH_BRIEF_REVIEW_REQUIRED'
      ? 'Demand signals and at least one primary technical source exist; a human may decide whether to research it.'
      : recommendation === 'HOLD_FOR_DEMAND_DATA'
        ? 'No permitted keyword-demand or live Search Console evidence is available yet; do not turn this into a content topic.'
        : 'The available evidence is too weak or too narrow to justify a new brief.',
    gsc: { source: gsc.source, impressions, clicks, rows: gscRows },
    community: { source: radar.source, signals: communitySignals },
    keywordIntelligence: { source: keywordIntelligence.inputs?.demandSource || 'unavailable', candidates: keywordCandidates, measuredCandidates: measuredKeywordCandidates },
    technicalSources,
  };
}).sort((left, right) => right.score - left.score).slice(0, policy.maximumPackets);

const report = {
  generatedAt: new Date().toISOString(),
  inputs: { gscSource: gsc.source, radarSource: radar.source, keywordDemandSource: keywordIntelligence.inputs?.demandSource || 'unavailable' },
  packets,
  guardrails: policy.guardrails,
};
await mkdir(reportRoot, { recursive: true });
await writeFile(resolve(reportRoot, 'research-director-latest.json'), `${JSON.stringify(report, null, 2)}\n`);
if (process.env.GITHUB_STEP_SUMMARY) {
  const summary = [
    '## GenATK research director',
    '',
    `- Search Console: **${gsc.source}**`,
    `- Topic radar: **${radar.source}**`,
    '',
    '| Topic | Decision | Score | GSC impressions | Community signals |',
    '| --- | --- | ---: | ---: | ---: |',
    ...packets.map((packet) => `| ${packet.topic} | ${packet.recommendation} | ${packet.score} | ${packet.gsc.impressions} | ${packet.community.signals.length} |`),
    '',
    'These are private research recommendations, not content decisions or publication instructions.',
    '',
  ].join('\n');
  await appendFile(process.env.GITHUB_STEP_SUMMARY, summary);
}
console.log(`Research director: ${packets.length} packet(s); GSC=${gsc.source}; radar=${radar.source}.`);
for (const packet of packets) console.log(`${packet.recommendation}: ${packet.topic} (${packet.score})`);
