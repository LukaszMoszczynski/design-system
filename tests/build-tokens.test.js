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

  it('shared.css sets color-scheme light on :root and dark on the dark block (native controls follow the theme)', () => {
    const css = read('tokens/shared.css');
    expect(css).toMatch(/^:root \{\n  color-scheme: light;\n/);
    expect(css).toContain(':root[data-theme="dark"] {\n  color-scheme: dark;\n');
  });

  it('<brand>.site.css has the brand values on a plain :root, for a one-brand site and the block editor', () => {
    for (const brand of ['dcc', 'omelanski']) {
      const site = read(`tokens/${brand}.site.css`);
      const scoped = read(`tokens/${brand}.css`);
      expect(site.startsWith(':root {\n')).toBe(true);
      expect(site).not.toContain('data-brand');
      expect(site).toBe(scoped.replace(`:root[data-brand="${brand}"]`, ':root'));
    }
    expect(read('tokens/dcc.site.css')).toContain('--palette-primary-600: #1269b0');
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

  it('shared.css builds the shadow tokens with the colour as a reference', () => {
    const css = read('tokens/shared.css');
    expect(css).toContain('--shadow-card: 0px 12px 32px 0px var(--color-shadow-card);');
    expect(css).toContain('--shadow-lift: 0px 4px 12px 0px var(--color-shadow-lift);');
  });

  it('shadow colours with alpha are defined in light and dark as 8-digit hex', () => {
    const css = read('tokens/shared.css');
    const dark = css.slice(css.indexOf(':root[data-theme="dark"]'));
    expect(css.slice(0, css.indexOf(':root[data-theme="dark"]'))).toMatch(/--color-shadow-card: #[0-9a-f]{8};/);
    expect(dark).toMatch(/--color-shadow-card: #[0-9a-f]{8};/);
  });

  it('brand css carries no shadow tokens', () => {
    for (const brand of ['dcc', 'omelanski']) expect(read(`tokens/${brand}.css`)).not.toContain('--shadow-');
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

  it('shadow lists and inset layers are kept', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'shadow-tokens-'));
    const out = mkdtempSync(join(tmpdir(), 'shadow-out-'));
    try {
      cpSync(tokensDir, dir, { recursive: true });
      const layer = (extra) => ({ color: '{color.shadow}', offsetX: '0px', offsetY: '2px', blur: '4px', spread: '0px', ...extra });
      writeFileSync(join(dir, 'effects.json'), JSON.stringify({
        shadow: {
          double: { $type: 'shadow', $value: [layer({ color: '#00000080' }), layer({ inset: true })] },
        },
      }));
      await buildTokens({ tokensDir: dir, outDir: out });
      const css = readFileSync(join(out, 'tokens', 'shared.css'), 'utf8');
      expect(css).toContain('--shadow-double: 0px 2px 4px 0px #00000080, inset 0px 2px 4px 0px var(--color-shadow);');
    } finally {
      rmSync(dir, { recursive: true, force: true });
      rmSync(out, { recursive: true, force: true });
    }
  });
});
