import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { readFileSync, writeFileSync, mkdtempSync, rmSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildTokens } from '../scripts/build-tokens.mjs';

const tokensDir = new URL('../tokens', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const mobileTokens = JSON.parse(readFileSync(join(tokensDir, 'breakpoint', 'mobile.json'), 'utf8'));

describe('buildTokens', () => {
  let outDir;
  const read = (file) => readFileSync(join(outDir, file), 'utf8');
  const readJson = (file) => JSON.parse(read(file));

  beforeAll(async () => {
    outDir = mkdtempSync(join(tmpdir(), 'build-tokens-'));
    await buildTokens({ tokensDir, outDir });
  });
  afterAll(() => rmSync(outDir, { recursive: true, force: true }));

  it('dcc.css sets palette on its brand selector', () => {
    const css = read('tokens/dcc.css');
    expect(css).toContain(':root[data-brand="dcc"]');
    expect(css).toContain('--palette-primary-600: #1269b0');
  });

  it('brand css honours ds.cssName and quotes font stacks', () => {
    expect(read('tokens/dcc.css')).toContain('--font-heading: "Ubuntu", ');
  });

  it('shared.css keeps references', () => {
    const css = read('tokens/shared.css');
    expect(css).toContain('--color-brand-primary: var(--palette-primary-600)');
    expect(css).not.toContain('#1269b0');
  });

  it('shared.css outputs raw component values as literals', () => {
    expect(read('tokens/shared.css')).toContain('--card-min-height: 469px');
  });

  it('shared.css has dark block', () => {
    const css = read('tokens/shared.css');
    expect(css).toContain(':root[data-theme="dark"]');
    expect(css).not.toContain('prefers-color-scheme');
  });

  it('h1 is fluid', () => {
    const css = read('tokens/shared.css');
    const match = /--font-size-4xl: clamp\(([\d.]+)px, [^,]+, ([\d.]+)px\);/.exec(css);
    expect(match).not.toBeNull();
    expect(`${match[1]}px`).toBe(mobileTokens.font.size['4xl'].$value);
    expect(match[2]).toBe('56');
  });

  it('shared.css mobile block skips fluid font sizes and keeps other differences', () => {
    const css = read('tokens/shared.css');
    const mobileBlock = css.slice(css.indexOf('@media (max-width: 781px)'));
    expect(mobileBlock).toContain('--space-section-y: 56px');
    expect(mobileBlock).not.toContain('--font-size-4xl');
    expect(mobileBlock).not.toContain('--font-size-body');
  });

  it('identical desktop and mobile font sizes stay plain', () => {
    expect(read('tokens/shared.css')).toContain('--font-size-body: 16px;');
  });

  it('theme.json palette resolves per brand', () => {
    const colorOf = (brand) =>
      readJson(`wp/${brand}.theme.json`).settings.color.palette.find((entry) => entry.slug === 'brand-primary').color;
    expect(colorOf('dcc')).toBe('#1269b0');
    expect(colorOf('omelanski')).toBe('#2a5db0');
  });

  it('theme.json lists fluid font sizes, families, spacing and layout', () => {
    const { settings } = readJson('wp/dcc.theme.json');
    const h1 = settings.typography.fontSizes.find((entry) => entry.slug === '4xl');
    expect(h1).toMatchObject({ size: '56px', fluid: { min: '32px', max: '56px' } });
    expect(settings.typography.fontFamilies.map((entry) => entry.slug)).toEqual(['heading', 'body', 'mono']);
    expect(settings.spacing.spacingSizes.find((entry) => entry.slug === '20').size).toBe('20px');
    expect(settings.layout).toEqual({ contentSize: '1240px', wideSize: '1440px' });
  });

  it('shared.css has no brand-prefixed names', () => {
    expect(read('tokens/shared.css')).not.toMatch(/--(dcc|omelanski)-/);
  });

  it('theme.json fluid range is 375 to 1200', () => {
    const { fluid } = readJson('wp/omelanski.theme.json').settings.typography;
    expect(fluid).toEqual({ minViewportSize: '375px', maxViewportSize: '1200px' });
  });

  it('theme.json disables core defaults', () => {
    const theme = readJson('wp/omelanski.theme.json');
    expect(theme.version).toBe(3);
    expect(theme.settings.color.defaultPalette).toBe(false);
    expect(theme.settings.typography.defaultFontSizes).toBe(false);
    expect(theme.settings.spacing.defaultSpacingSizes).toBe(false);
    expect(theme.settings.color.custom).toBe(false);
  });
});

describe('buildTokens guards', () => {
  const buildWithComponentTokens = async (extra) => {
    const dir = mkdtempSync(join(tmpdir(), 'guard-tokens-'));
    const out = mkdtempSync(join(tmpdir(), 'guard-out-'));
    try {
      cpSync(tokensDir, dir, { recursive: true });
      const file = join(dir, 'component.json');
      writeFileSync(file, JSON.stringify({ ...JSON.parse(readFileSync(file, 'utf8')), ...extra }));
      await buildTokens({ tokensDir: dir, outDir: out });
    } finally {
      rmSync(dir, { recursive: true, force: true });
      rmSync(out, { recursive: true, force: true });
    }
  };
  const named = (cssName) => ({ $type: 'dimension', $value: '1px', $extensions: { 'ds.cssName': cssName } });

  it('throws on a duplicate CSS name in one output', async () => {
    await expect(buildWithComponentTokens({ one: named('same-name'), two: named('same-name') })).rejects.toThrow(/Duplicate CSS custom property --same-name/);
  });

  it('throws on a brand-prefixed name in shared.css', async () => {
    await expect(buildWithComponentTokens({ one: named('dcc-thing') })).rejects.toThrow(/brand-specific names: --dcc-thing/);
  });
});
