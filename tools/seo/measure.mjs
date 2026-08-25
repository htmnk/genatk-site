import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { repoRoot, readJson } from './shared.mjs';

const metrics = await readJson('marketing/fixtures/metrics.json');
const policy = await readJson('marketing/policies/measurement.json');
const launch = new Date(metrics.launchDate);
const ageInDays = Math.floor((Date.now() - launch) / 86_400_000);
const conversionCount = Object.entries(metrics.qualifiedConversions)
  .filter(([event]) => policy.qualifiedConversionEvents.includes(event))
  .reduce((total, [, count]) => total + count, 0);
const signals = {
  at_least_3_qualified_conversions: conversionCount >= 3,
  organic_clicks_growing_over_two_28_day_windows: metrics.organicClicks.current28Days > metrics.organicClicks.previous28Days,
  target_intent_queries_reached: metrics.targetIntentQueries >= 5,
  at_least_80_percent_of_published_pages_indexed: metrics.publishedPages > 0 && metrics.indexedPages / metrics.publishedPages >= 0.8,
};
const positiveSignals = Object.values(signals).filter(Boolean).length;
let recommendation = 'COLLECT_MORE_DATA';
if (ageInDays >= policy.decisionDayAfterLaunch && metrics.publishedPages >= policy.minimumPublishedPages) {
  recommendation = positiveSignals >= policy.continueIf.minimumPositiveSignals ? 'CONTINUE' : signals.target_intent_queries_reached ? 'ITERATE' : 'PAUSE';
}
const report = { generatedAt: new Date().toISOString(), ageInDays, positiveSignals, signals, recommendation, metrics };
const reportRoot = resolve(repoRoot, 'marketing/reports');
await mkdir(reportRoot, { recursive: true });
await writeFile(resolve(reportRoot, 'experiment-report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`${recommendation}: ${positiveSignals} positive signal(s), ${ageInDays} day(s) since launch.`);
