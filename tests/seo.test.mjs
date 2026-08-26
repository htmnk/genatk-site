import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { queryOverlap, queryTokens } from '../tools/seo/shared.mjs';

const keywordPolicy = JSON.parse(await readFile(new URL('../marketing/policies/keyword-intelligence.json', import.meta.url), 'utf8'));

test('normalizes simple plural query variants', () => {
  assert.deepEqual([...queryTokens('Game-ready generated 3D assets')].sort(), ['3d', 'asset', 'game', 'generated', 'ready']);
});

test('treats near-identical query intents as overlapping', () => {
  assert.ok(queryOverlap('game ready generated 3d assets', 'game-ready generated 3d asset checklist') >= 0.7);
});

test('does not merge unrelated query intents', () => {
  assert.ok(queryOverlap('game ready generated 3d assets', 'procedural dungeon room generation') < 0.7);
});

test('keyword intelligence excludes product and competitor terms from its public topic hypotheses', () => {
  assert.ok(keywordPolicy.excludedTerms.includes('genatk'));
  assert.ok(keywordPolicy.excludedTerms.includes('forge'));
  assert.ok(keywordPolicy.excludedTerms.includes('meshy'));
  assert.equal(keywordPolicy.seedClusters.length >= 4, true);
});
