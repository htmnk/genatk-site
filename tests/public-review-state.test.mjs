import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../apps/site/src/lib/public-review-state.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const reviewState = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('the same public review inputs create the same review key', () => {
  const input = {
    assetId: 'wayfinder-004287',
    generatorRevision: 'public-study-1',
    seed: 4287,
    settings: { palette: 'verdant', form: 'shrine' },
    exportTarget: 'illustrative-webgl',
  };
  assert.deepEqual(reviewState.createPublicReviewState(input), reviewState.createPublicReviewState(input));
});

test('settings order does not change a public review key', () => {
  const first = reviewState.createPublicReviewState({ assetId: 'study-01', generatorRevision: 'v1', seed: 42, settings: { form: 'gate', light: 'ember' }, exportTarget: 'web' });
  const second = reviewState.createPublicReviewState({ assetId: 'study-01', generatorRevision: 'v1', seed: 42, settings: { light: 'ember', form: 'gate' }, exportTarget: 'web' });
  assert.equal(first.reviewKey, second.reviewKey);
});

test('a changed revision changes a public review key', () => {
  const first = reviewState.createPublicReviewState({ assetId: 'study-01', generatorRevision: 'v1', seed: 42, settings: {}, exportTarget: 'web' });
  const second = reviewState.createPublicReviewState({ assetId: 'study-01', generatorRevision: 'v2', seed: 42, settings: {}, exportTarget: 'web' });
  assert.notEqual(first.reviewKey, second.reviewKey);
});
