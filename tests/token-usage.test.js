import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { globFiles } from '../scripts/glob-files.mjs';

const BRANDS = ['dcc', 'omelanski'];
const defined = (file) => new Set([...readFileSync(file, 'utf8').matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1]));
const shared = defined('dist/tokens/shared.css');

function usedTokens() {
  const used = new Map();
  for (const file of globFiles('components/**/*.css')) {
    const css = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    const own = new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1]));
    for (const [, name] of css.matchAll(/var\(\s*(--[\w-]+)/g)) {
      if (!own.has(name)) used.set(name, [...(used.get(name) ?? []), file.replaceAll('\\', '/')]);
    }
  }
  return used;
}

describe('token usage', () => {
  it('scans real component CSS', () => {
    const files = globFiles('components/**/*.css');
    expect(files).toContain('components/base/base.css');
    expect(files).toContain('components/_template/_template.css');
    expect(usedTokens().size).toBeGreaterThan(0);
  });

  it('finds the built token files', () => {
    expect(shared.size).toBeGreaterThan(0);
    for (const brand of BRANDS) expect(defined(`dist/tokens/${brand}.css`).size).toBeGreaterThan(0);
  });

  for (const brand of BRANDS) {
    it(`every var() used in components exists for ${brand}`, () => {
      const known = new Set([...shared, ...defined(`dist/tokens/${brand}.css`)]);
      const missing = [...usedTokens()].filter(([name]) => !known.has(name)).map(([name, files]) => `${name} (${[...new Set(files)].join(', ')})`);
      expect(missing).toEqual([]);
    });
  }
});
