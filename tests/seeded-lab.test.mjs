import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../apps/site/src/lib/seeded-lab.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const lab = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('the same lab inputs create the same illustrated geometry', () => {
  const input = { archetype: 'arch', seed: 42, tone: 'moss' };
  assert.deepEqual(lab.createLabAsset(input), lab.createLabAsset(input));
});

test('appearance presets do not change the lab geometry identity', () => {
  const moss = lab.createLabAsset({ archetype: 'beacon', seed: 42, tone: 'moss' });
  const ember = lab.createLabAsset({ archetype: 'beacon', seed: 42, tone: 'ember' });
  assert.equal(moss.geometryId, ember.geometryId);
  assert.notEqual(moss.svg, ember.svg);
});

test('a changed seed produces a different identity for every lab archetype', () => {
  for (const archetype of ['arch', 'beacon', 'pavilion']) {
    const first = lab.createLabAsset({ archetype, seed: 42, tone: 'moss' });
    const next = lab.createLabAsset({ archetype, seed: 99, tone: 'moss' });
    assert.notEqual(first.geometryId, next.geometryId);
  }
});
