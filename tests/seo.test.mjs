import assert from 'node:assert/strict';
import test from 'node:test';
import { queryOverlap, queryTokens } from '../tools/seo/shared.mjs';

test('normalizes simple plural query variants', () => {
  assert.deepEqual([...queryTokens('Game-ready generated 3D assets')].sort(), ['3d', 'asset', 'game', 'generated', 'ready']);
});

test('treats near-identical query intents as overlapping', () => {
  assert.ok(queryOverlap('game ready generated 3d assets', 'game-ready generated 3d asset checklist') >= 0.7);
});

test('does not merge unrelated query intents', () => {
  assert.ok(queryOverlap('game ready generated 3d assets', 'procedural dungeon room generation') < 0.7);
});

