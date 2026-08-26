/**
 * A deliberately small public example for recording a generated variation.
 * It is independent of GenATK product code and does not generate geometry.
 */
export interface PublicReviewStateInput {
  assetId: string;
  generatorRevision: string;
  seed: number;
  settings: Record<string, string | number | boolean>;
  exportTarget: string;
}

export interface PublicReviewState {
  assetId: string;
  generatorRevision: string;
  seed: number;
  settings: Record<string, string | number | boolean>;
  exportTarget: string;
  reviewKey: string;
}

function normalizeSeed(seed: number) {
  return Number.isFinite(seed) ? (Math.trunc(seed) >>> 0) : 0;
}

function stableSettings(settings: PublicReviewStateInput['settings']) {
  return Object.fromEntries(Object.entries(settings).sort(([left], [right]) => left.localeCompare(right)));
}

function smallHash(value: string) {
  let state = 2166136261;
  for (const character of value) {
    state ^= character.charCodeAt(0);
    state = Math.imul(state, 16777619);
  }
  return (state >>> 0).toString(36).padStart(7, '0');
}

export function createPublicReviewState(input: PublicReviewStateInput): PublicReviewState {
  const seed = normalizeSeed(input.seed);
  const settings = stableSettings(input.settings);
  const identity = JSON.stringify({
    assetId: input.assetId.trim(),
    generatorRevision: input.generatorRevision.trim(),
    seed,
    settings,
    exportTarget: input.exportTarget.trim(),
  });

  return {
    assetId: input.assetId.trim(),
    generatorRevision: input.generatorRevision.trim(),
    seed,
    settings,
    exportTarget: input.exportTarget.trim(),
    reviewKey: `review-${smallHash(identity)}`,
  };
}
