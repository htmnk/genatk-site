import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export const repoRoot = resolve(import.meta.dirname, '../..');
export const siteRoot = resolve(repoRoot, 'apps/site');
export const contentRoot = resolve(siteRoot, 'src/content');

export async function readJson(relativePath) {
  return JSON.parse(await readFile(resolve(repoRoot, relativePath), 'utf8'));
}

export function parseFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return { attributes: {}, body: source, error: 'Missing YAML frontmatter.' };
  const attributes = Object.fromEntries(match[1].split('\n').flatMap((line) => {
    const found = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.+)$/);
    return found ? [[found[1], found[2].replace(/^['"]|['"]$/g, '')]] : [];
  }));
  return { attributes, body: source.slice(match[0].length) };
}

export function queryTokens(value) {
  return new Set(value.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((token) => token.length > 2 || /^\d+d$/.test(token)).map((token) => token.replace(/s$/, '')));
}

export function queryOverlap(left, right) {
  const a = queryTokens(left);
  const b = queryTokens(right);
  const intersection = [...a].filter((token) => b.has(token)).length;
  return intersection / Math.max(a.size, b.size, 1);
}
