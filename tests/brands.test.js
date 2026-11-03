import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { brandNamesFromPaths, brandTitle } from '../scripts/brands.mjs';
import { listBrands } from '../scripts/list-brands.mjs';

let temp;
afterEach(() => temp && rmSync(temp, { recursive: true, force: true }));

describe('brand list', () => {
  it('lists the real brands', () => {
    expect(listBrands()).toEqual(['dcc', 'omelanski']);
  });

  it('picks up a third brand by adding its token file only', () => {
    temp = mkdtempSync(join(tmpdir(), 'ds-brands-'));
    mkdirSync(join(temp, 'tokens', 'brands'), { recursive: true });
    for (const name of ['dcc', 'omelanski', 'acme']) writeFileSync(join(temp, 'tokens', 'brands', `${name}.json`), '{}');
    expect(listBrands(temp)).toEqual(['acme', 'dcc', 'omelanski']);
  });

  it('derives Storybook brands from built CSS paths, without shared.css and <brand>.site.css', () => {
    const paths = ['../dist/tokens/shared.css', '../dist/tokens/dcc.css', '../dist/tokens/dcc.site.css', '../dist/tokens/acme.css'];
    expect(brandNamesFromPaths(paths)).toEqual(['acme', 'dcc']);
  });

  it('titles come from brand.json, else the capitalised name', () => {
    expect(brandTitle('dcc', { dcc: 'DCC' })).toBe('DCC');
    expect(brandTitle('acme')).toBe('Acme');
  });
});
