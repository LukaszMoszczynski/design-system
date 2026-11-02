// Builds dist/tokens/<brand>.css, dist/tokens/shared.css and dist/wp/<brand>.theme.json
// from the DTCG token files in tokens/ with Style Dictionary 4.
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import StyleDictionary from 'style-dictionary';

const MOBILE_MAX_WIDTH = 781;
const FLUID_FROM = 375;
const FLUID_TO = 1200;
const WIDE_SIZE = '1440px';
const FONT_FALLBACKS = { heading: 'system-ui, sans-serif', body: 'system-ui, sans-serif', mono: 'ui-monospace, monospace' };

const posix = (path) => path.replace(/\\/g, '/');
const isBrandToken = (token) => posix(token.filePath).includes('/brands/');
const isFluidCandidate = (token) => token.path[0] === 'font' && (token.path[1] === 'size' || token.path[1] === 'line-height');
const cssName = (token) => token.$extensions?.['ds.cssName'] ?? token.path.join('-');
const pixels = (value) => Number.parseFloat(value);
const trimNumber = (number) => String(Number(number.toFixed(4)));

function fontStack(token) {
  if (token.$value.includes(',')) return token.$value;
  const fallback = FONT_FALLBACKS[token.path.at(-1)] ?? 'sans-serif';
  return `"${token.$value}", ${fallback}`;
}

// Aliases become var(--name); raw values stay literal.
function declaredValue(token, namesByPath) {
  const original = token.original.$value;
  if (typeof original === 'string' && /\{[^{}]+\}/.test(original)) {
    return original.replace(/\{([^{}]+)\}/g, (_match, path) => {
      const name = namesByPath.get(path);
      if (!name) throw new Error(`${token.path.join('.')} aliases {${path}}, which is not in the build`);
      return `var(--${name})`;
    });
  }
  return token.$type === 'fontFamily' ? fontStack(token) : String(token.$value);
}

function namesByPathOf(dictionary) {
  return new Map(dictionary.unfilteredAllTokens.map((token) => [token.path.join('.'), cssName(token)]));
}

function block(selector, declarations, indent = '') {
  const lines = declarations.map(([name, value]) => `${indent}  --${name}: ${value};`);
  return `${indent}${selector} {\n${lines.join('\n')}\n${indent}}`;
}

StyleDictionary.registerFormat({
  name: 'ds/css-brand',
  format: ({ dictionary, options }) => {
    const names = namesByPathOf(dictionary);
    const declarations = dictionary.allTokens.map((token) => [cssName(token), declaredValue(token, names)]);
    return `${block(`:root[data-brand="${options.brand}"]`, declarations)}\n`;
  },
});

// options.section: "root" | "dark" | "mobile"
// options.fluid: Map css name -> clamp() for font sizes and line heights that change with the breakpoint
// options.desktopValues: Map css name -> desktop original value (mobile section only)
StyleDictionary.registerFormat({
  name: 'ds/css-shared',
  format: ({ dictionary, options }) => {
    const names = namesByPathOf(dictionary);
    const declare = (token) => [cssName(token), options.fluid.get(cssName(token)) ?? declaredValue(token, names)];
    if (options.section === 'dark') {
      return block(':root[data-theme="dark"]', dictionary.allTokens.map(declare));
    }
    if (options.section === 'mobile') {
      const differing = dictionary.allTokens
        .filter((token) => !options.fluid.has(cssName(token)))
        .filter((token) => options.desktopValues.get(cssName(token)) !== token.original.$value)
        .map(declare);
      return `@media (max-width: ${MOBILE_MAX_WIDTH}px) {\n${block(':root', differing, '  ')}\n}`;
    }
    return block(':root', dictionary.allTokens.map(declare));
  },
});

const titleCase = (slug) => {
  const words = slug.replace(/-/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
};

// options.mobileSizes: Map css name -> mobile px string
StyleDictionary.registerFormat({
  name: 'ds/wp-theme-json',
  format: ({ dictionary, options }) => {
    const all = dictionary.allTokens;
    const brandTokens = all.filter(isBrandToken);
    const brandToken = (path) => brandTokens.find((token) => token.path.join('.') === path);

    const palette = all
      .filter((token) => posix(token.filePath).endsWith('/semantic/light.json') && token.path[0] === 'color')
      .map((token) => {
        const slug = token.path.slice(1).join('-');
        return { slug, name: titleCase(slug), color: token.$value };
      });

    const fontFamilies = ['heading', 'body', 'mono'].map((slug) => ({
      slug,
      name: titleCase(slug),
      fontFamily: fontStack(brandToken(`font.family.${slug}`)),
    }));

    const fontSizes = all
      .filter((token) => !isBrandToken(token) && token.path[0] === 'font' && token.path[1] === 'size')
      .map((token) => {
        const slug = token.path.slice(2).join('-');
        return { slug, name: slug.toUpperCase(), size: token.$value, fluid: { min: options.mobileSizes.get(cssName(token)), max: token.$value } };
      });

    const spacingSizes = brandTokens
      .filter((token) => token.path[0] === 'space')
      .map((token) => {
        const slug = token.path.slice(1).join('-');
        return { slug, name: slug, size: token.$value };
      });

    const theme = {
      $schema: 'https://schemas.wp.org/trunk/theme.json',
      version: 3,
      settings: {
        color: { defaultPalette: false, custom: false, palette },
        typography: { defaultFontSizes: false, customFontSize: false, fontFamilies, fontSizes },
        spacing: { defaultSpacingSizes: false, customSpacingSize: false, spacingSizes },
        layout: { contentSize: brandToken('layout.container').$value, wideSize: WIDE_SIZE },
      },
    };
    return `${JSON.stringify(theme, null, 2)}\n`;
  },
});

function sdConfig(files, format, options = {}, filter) {
  return {
    log: { warnings: 'warn', verbosity: 'silent' },
    source: files.map(posix),
    platforms: { css: { files: [{ destination: 'unused', format, options, ...(filter ? { filter } : {}) }] } },
  };
}

async function render(files, format, options, filter) {
  const dictionary = new StyleDictionary(sdConfig(files, format, options, filter));
  const [{ output }] = await dictionary.formatPlatform('css');
  return output;
}

async function resolvedTokens(files) {
  const dictionary = new StyleDictionary(sdConfig(files, 'ds/css-brand'));
  return (await dictionary.getPlatformTokens('css')).allTokens;
}

function clamp(mobileValue, desktopValue) {
  const [mobile, desktop] = [pixels(mobileValue), pixels(desktopValue)];
  const slope = (desktop - mobile) / (FLUID_TO - FLUID_FROM);
  const intercept = mobile - slope * FLUID_FROM;
  const lower = Math.min(mobile, desktop);
  const upper = Math.max(mobile, desktop);
  return `clamp(${trimNumber(lower)}px, ${trimNumber(intercept)}px + ${trimNumber(slope * 100)}vw, ${trimNumber(upper)}px)`;
}

// css name -> resolved px, for the font sizes and line heights of one breakpoint file under one brand
async function fontValues(files) {
  const tokens = await resolvedTokens(files);
  return new Map(tokens.filter((token) => !isBrandToken(token) && isFluidCandidate(token)).map((token) => [cssName(token), token.$value]));
}

function listBrands(tokensDir) {
  return readdirSync(join(tokensDir, 'brands'))
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace(/\.json$/, ''))
    .sort();
}

export async function buildTokens({ tokensDir, outDir }) {
  const dir = resolve(tokensDir);
  const out = resolve(outDir);
  const file = (...parts) => join(dir, ...parts);
  const brands = listBrands(dir);
  mkdirSync(join(out, 'tokens'), { recursive: true });
  mkdirSync(join(out, 'wp'), { recursive: true });

  const fluidByBrand = new Map();
  const mobileSizesByBrand = new Map();
  for (const brand of brands) {
    const brandFile = file('brands', `${brand}.json`);
    const desktop = await fontValues([brandFile, file('breakpoint', 'desktop.json')]);
    const mobile = await fontValues([brandFile, file('breakpoint', 'mobile.json')]);
    const fluid = new Map();
    for (const [name, desktopValue] of desktop) {
      const mobileValue = mobile.get(name);
      if (mobileValue !== undefined && pixels(mobileValue) !== pixels(desktopValue)) fluid.set(name, clamp(mobileValue, desktopValue));
    }
    fluidByBrand.set(brand, fluid);
    mobileSizesByBrand.set(brand, mobile);
  }

  // shared.css cannot follow a brand, so the first brand decides; warn when another brand disagrees.
  const [referenceBrand] = brands;
  const fluid = fluidByBrand.get(referenceBrand);
  for (const brand of brands) {
    const brandFluid = fluidByBrand.get(brand);
    const names = new Set([...fluid.keys(), ...brandFluid.keys()]);
    for (const name of names) {
      if (fluid.get(name) !== brandFluid.get(name)) console.warn(`--${name} resolves differently for ${brand} and ${referenceBrand}; shared.css uses ${referenceBrand}`);
    }
  }

  const referenceFile = file('brands', `${referenceBrand}.json`);
  const sharedFilter = (token) => !isBrandToken(token);
  const desktopTokens = await resolvedTokens([referenceFile, file('breakpoint', 'desktop.json')]);
  const desktopValues = new Map(desktopTokens.filter(sharedFilter).map((token) => [cssName(token), token.original.$value]));

  const root = await render([referenceFile, file('semantic', 'light.json'), file('breakpoint', 'desktop.json'), file('component.json')], 'ds/css-shared', { section: 'root', fluid }, sharedFilter);
  const dark = await render([referenceFile, file('semantic', 'dark.json')], 'ds/css-shared', { section: 'dark', fluid }, sharedFilter);
  const mobile = await render([referenceFile, file('breakpoint', 'mobile.json')], 'ds/css-shared', { section: 'mobile', fluid, desktopValues }, sharedFilter);
  writeFileSync(join(out, 'tokens', 'shared.css'), `${root}\n\n${dark}\n\n${mobile}\n`);

  for (const brand of brands) {
    const brandFile = file('brands', `${brand}.json`);
    writeFileSync(join(out, 'tokens', `${brand}.css`), await render([brandFile], 'ds/css-brand', { brand }));
    const theme = await render([brandFile, file('semantic', 'light.json'), file('breakpoint', 'desktop.json')], 'ds/wp-theme-json', { mobileSizes: mobileSizesByBrand.get(brand) });
    writeFileSync(join(out, 'wp', `${brand}.theme.json`), theme);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await buildTokens({ tokensDir: process.argv[2] ?? 'tokens', outDir: process.argv[3] ?? 'dist' });
  console.log('Built dist/tokens and dist/wp.');
}
