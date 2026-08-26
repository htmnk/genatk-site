export type WayfinderArchetype = 'shrine' | 'beacon' | 'gate';
export type WayfinderPalette = 'verdant' | 'solar' | 'ember';

export interface WayfinderInput {
  archetype: WayfinderArchetype;
  palette: WayfinderPalette;
  seed: number;
}

export interface WayfinderSpec {
  normalizedSeed: number;
  geometryId: string;
  appearanceId: string;
  baseRadius: number;
  height: number;
  pillarCount: number;
  shardCount: number;
  crownScale: number;
  orbitRadius: number;
}

function normalizeSeed(seed: number) {
  return Number.isFinite(seed) ? (Math.trunc(seed) >>> 0) : 0;
}

// Intentionally small and independent: this illustrative lab does not use product code.
function randomFrom(seed: number) {
  let state = normalizeSeed(seed) || 0x9e3779b9;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

function hash(value: string) {
  let state = 2166136261;
  for (const character of value) {
    state ^= character.charCodeAt(0);
    state = Math.imul(state, 16777619);
  }
  return (state >>> 0).toString(36).padStart(7, '0');
}

export function createWayfinderSpec(input: WayfinderInput): WayfinderSpec {
  const normalizedSeed = normalizeSeed(input.seed);
  const random = randomFrom(normalizedSeed);
  const archetypeBias = input.archetype === 'shrine' ? 0 : input.archetype === 'beacon' ? 0.28 : -0.14;
  const baseRadius = Number((1.45 + random() * 0.55).toFixed(3));
  const height = Number((2.8 + archetypeBias + random() * 1.2).toFixed(3));
  const pillarCount = input.archetype === 'gate' ? 2 : 3 + Math.floor(random() * 3);
  const shardCount = 5 + Math.floor(random() * 5);
  const crownScale = Number((0.72 + random() * 0.48).toFixed(3));
  const orbitRadius = Number((1.75 + random() * 0.58).toFixed(3));
  const geometry = [input.archetype, normalizedSeed, baseRadius, height, pillarCount, shardCount, crownScale, orbitRadius].join(':');

  return {
    normalizedSeed,
    geometryId: `way-${hash(geometry)}`,
    appearanceId: `palette-${input.palette}`,
    baseRadius,
    height,
    pillarCount,
    shardCount,
    crownScale,
    orbitRadius,
  };
}
