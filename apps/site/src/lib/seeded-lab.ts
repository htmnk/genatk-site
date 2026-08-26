export type LabArchetype = 'arch' | 'beacon' | 'pavilion';
export type LabTone = 'moss' | 'sand' | 'ember';

export interface LabInput {
  archetype: LabArchetype;
  seed: number;
  tone: LabTone;
}

export interface LabAsset {
  geometryId: string;
  appearanceId: string;
  svg: string;
}

const palettes: Record<LabTone, { background: string; ink: string; stone: string; accent: string }> = {
  moss: { background: '#15201a', ink: '#dae7d2', stone: '#78936d', accent: '#c7df9d' },
  sand: { background: '#251d13', ink: '#f3e5c9', stone: '#b89158', accent: '#ffd98b' },
  ember: { background: '#251616', ink: '#f4d9d2', stone: '#aa6f5f', accent: '#ffae88' },
};

function normaliseSeed(seed: number) {
  return Number.isFinite(seed) ? (Math.trunc(seed) >>> 0) : 0;
}

// A deliberately small, illustrative generator. It is independent of any product code.
function randomFrom(seed: number) {
  let state = normaliseSeed(seed) || 0x6d2b79f5;
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

function svgFrame(content: string, palette: (typeof palettes)[LabTone]) {
  return `<svg viewBox="0 0 360 240" role="img" aria-label="Illustrative generated asset" xmlns="http://www.w3.org/2000/svg"><rect width="360" height="240" fill="${palette.background}"/><path d="M0 196H360" stroke="${palette.ink}" stroke-opacity=".25"/>${content}</svg>`;
}

function arch(seed: number, palette: (typeof palettes)[LabTone]) {
  const random = randomFrom(seed);
  const width = 130 + Math.round(random() * 80);
  const height = 90 + Math.round(random() * 45);
  const x = Math.round((360 - width) / 2);
  const y = 196 - height;
  const opening = 34 + Math.round(random() * 24);
  const cap = 12 + Math.round(random() * 18);
  const left = x + Math.round((width - opening) / 2);
  const right = left + opening;
  const geometry = `arch:${x}:${y}:${width}:${height}:${opening}:${cap}`;
  const content = `<path d="M${x} 196V${y + cap}Q${x + width / 2} ${y - cap} ${x + width} ${y + cap}V196H${right}V${y + 48}Q${x + width / 2} ${y + 14} ${left} ${y + 48}V196Z" fill="${palette.stone}"/><path d="M${x + 12} ${y + cap + 12}Q180 ${y + 4} ${x + width - 12} ${y + cap + 12}" fill="none" stroke="${palette.accent}" stroke-width="5" stroke-linecap="round"/><circle cx="${x + width / 2}" cy="${y + 28}" r="5" fill="${palette.accent}"/>`;
  return { geometry, content };
}

function beacon(seed: number, palette: (typeof palettes)[LabTone]) {
  const random = randomFrom(seed);
  const width = 52 + Math.round(random() * 28);
  const height = 105 + Math.round(random() * 50);
  const x = Math.round((360 - width) / 2);
  const y = 196 - height;
  const roof = 20 + Math.round(random() * 18);
  const windowY = y + 38 + Math.round(random() * 16);
  const geometry = `beacon:${x}:${y}:${width}:${height}:${roof}:${windowY}`;
  const content = `<path d="M${x} 196L${x + 8} ${y + roof}H${x + width - 8}L${x + width} 196Z" fill="${palette.stone}"/><path d="M${x - 10} ${y + roof}L${x + width / 2} ${y - roof}L${x + width + 10} ${y + roof}Z" fill="${palette.accent}"/><rect x="${x + width / 2 - 11}" y="${windowY}" width="22" height="27" rx="11" fill="${palette.background}" stroke="${palette.ink}" stroke-width="3"/><path d="M${x + width / 2} ${y - roof}V${y - roof - 24}H${x + width / 2 + 22}" stroke="${palette.ink}" stroke-width="4"/><path d="M${x + width / 2 + 22} ${y - roof - 24}l-13 8 13 8Z" fill="${palette.accent}"/>`;
  return { geometry, content };
}

function pavilion(seed: number, palette: (typeof palettes)[LabTone]) {
  const random = randomFrom(seed);
  const width = 140 + Math.round(random() * 70);
  const roof = 32 + Math.round(random() * 24);
  const x = Math.round((360 - width) / 2);
  const columnHeight = 74 + Math.round(random() * 45);
  const y = 196 - columnHeight;
  const spacing = Math.round(width / 3);
  const geometry = `pavilion:${x}:${y}:${width}:${roof}:${columnHeight}:${spacing}`;
  const columns = [0, 1, 2, 3].map((index) => `<rect x="${x + index * spacing - 6}" y="${y}" width="12" height="${columnHeight}" rx="4" fill="${palette.stone}"/>`).join('');
  const content = `<path d="M${x - 12} ${y}L180 ${y - roof}L${x + width + 12} ${y}Z" fill="${palette.accent}"/><path d="M${x - 4} ${y + 10}H${x + width + 4}" stroke="${palette.ink}" stroke-opacity=".65" stroke-width="7"/>${columns}<path d="M${x + width / 2} ${y - roof}V${y - roof - 24}" stroke="${palette.ink}" stroke-width="4"/><circle cx="${x + width / 2}" cy="${y - roof - 29}" r="6" fill="${palette.accent}"/>`;
  return { geometry, content };
}

export function createLabAsset(input: LabInput): LabAsset {
  const seed = normaliseSeed(input.seed);
  const palette = palettes[input.tone];
  const structure = input.archetype === 'arch' ? arch(seed, palette) : input.archetype === 'beacon' ? beacon(seed, palette) : pavilion(seed, palette);
  return {
    geometryId: `lab-${hash(structure.geometry)}`,
    appearanceId: `tone-${input.tone}`,
    svg: svgFrame(structure.content, palette),
  };
}
