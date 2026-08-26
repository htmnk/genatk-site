import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../apps/site/src/lib/wayfinder-spec.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const wayfinder = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('the same Wayfinder inputs recreate the same reviewable specification', () => {
  const input = { archetype: 'shrine', seed: 4287, palette: 'verdant' };
  assert.deepEqual(wayfinder.createWayfinderSpec(input), wayfinder.createWayfinderSpec(input));
});

test('a palette is excluded from the Wayfinder geometry identity', () => {
  const verdant = wayfinder.createWayfinderSpec({ archetype: 'beacon', seed: 4287, palette: 'verdant' });
  const ember = wayfinder.createWayfinderSpec({ archetype: 'beacon', seed: 4287, palette: 'ember' });
  assert.equal(verdant.geometryId, ember.geometryId);
  assert.notEqual(verdant.appearanceId, ember.appearanceId);
});

test('different seeds yield different identities across all illustrative forms', () => {
  for (const archetype of ['shrine', 'beacon', 'gate']) {
    const first = wayfinder.createWayfinderSpec({ archetype, seed: 1, palette: 'verdant' });
    const second = wayfinder.createWayfinderSpec({ archetype, seed: 2, palette: 'verdant' });
    assert.notEqual(first.geometryId, second.geometryId);
  }
});
