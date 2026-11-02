// Turns the raw Figma variable export (scripts/sync/figma-export.js) into DTCG token files.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const NUMBER_NAME = /weight|opacity|line-height-ratio/;
const FONT_WEIGHTS = {
  thin: 100, extralight: 200, light: 300, regular: 400, normal: 400, medium: 500,
  semibold: 600, bold: 700, extrabold: 800, black: 900,
};
const CSS_VAR = /^var\(--([\w-]+)\)$/;

const toKebab = (text) => text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const roundNumber = (number) => Number(number.toFixed(3));
const toHexByte = (channel) => Math.round(channel * 255).toString(16).padStart(2, '0');

function toHex({ r, g, b, a }) {
  const hex = `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`;
  return a < 1 ? hex + toHexByte(a) : hex;
}

function aliasReference(alias) {
  // "Brand/palette/primary/600" -> "{palette.primary.600}" (the collection is not part of the path)
  return `{${alias.split('/').slice(1).join('.')}}`;
}

function tokenType(variable) {
  if (variable.type === 'COLOR') return 'color';
  if (variable.type === 'FLOAT') return NUMBER_NAME.test(variable.name) ? 'number' : 'dimension';
  if (/weight/.test(variable.name)) return 'fontWeight';
  if (/family/.test(variable.name)) return 'fontFamily';
  throw new Error(`Unsupported STRING variable "${variable.name}"`);
}

function plainValue(variable, value) {
  if (variable.type === 'COLOR') return toHex(value);
  if (variable.type === 'FLOAT') {
    return NUMBER_NAME.test(variable.name) ? roundNumber(value) : `${roundNumber(value)}px`;
  }
  if (/weight/.test(variable.name)) {
    const weight = FONT_WEIGHTS[value.toLowerCase().replace(/[\s-]/g, '')];
    if (weight === undefined) throw new Error(`Unknown font weight "${value}" in "${variable.name}"`);
    return weight;
  }
  return value;
}

function cssNameExtension(variable, brandNames) {
  const match = CSS_VAR.exec(variable.codeSyntax || '');
  const defaultName = variable.name.split('/').join('-');
  // Code syntax that is not a plain var(--name) (e.g. "min-height: 800px") is ignored.
  // So is one that starts with a brand name: shared CSS must not carry brand-specific names.
  if (!match || match[1] === defaultName) return null;
  if (brandNames.some((brand) => match[1].startsWith(`${brand}-`))) return null;
  return { 'ds.cssName': match[1] };
}

function buildToken(variable, modeId, brandNames) {
  const value = variable.valuesByMode[modeId];
  if (value === undefined) return null;
  const token = {
    $type: tokenType(variable),
    $value: typeof value === 'object' && 'alias' in value ? aliasReference(value.alias) : plainValue(variable, value),
  };
  if (variable.description) token.$description = variable.description;
  const cssName = cssNameExtension(variable, brandNames);
  if (cssName) token.$extensions = cssName;
  return token;
}

function insertToken(tree, path, token) {
  const segments = path.split('/');
  let node = tree;
  for (const segment of segments.slice(0, -1)) {
    if (node[segment] && '$value' in node[segment]) throw new Error(`"${path}" nests inside token "${segment}"`);
    node = node[segment] ??= {};
  }
  const leaf = segments[segments.length - 1];
  if (node[leaf]) throw new Error(`"${path}" is both a token and a group`);
  node[leaf] = token;
}

function filePathFor(collection, mode) {
  const collectionKey = toKebab(collection.name);
  if (collection.modes.length === 1) return `${collectionKey}.json`;
  const directory = collectionKey === 'brand' ? 'brands' : collectionKey;
  return `${directory}/${toKebab(mode.name)}.json`;
}

// One Figma shadow effect -> DTCG shadow value. A colour bound to a variable becomes an alias; Figma
// then reports the variable's colour, so an alpha below 1 is kept apart as ds.colorAlpha.
function shadowValue(effect) {
  const value = {
    color: effect.colorAlias ? aliasReference(effect.colorAlias) : toHex(effect.color),
    offsetX: `${roundNumber(effect.offsetX)}px`,
    offsetY: `${roundNumber(effect.offsetY)}px`,
    blur: `${roundNumber(effect.blur)}px`,
    spread: `${roundNumber(effect.spread)}px`,
  };
  if (effect.type === 'INNER_SHADOW') value.inset = true;
  return value;
}

function effectTokens(effectStyles) {
  const tree = {};
  for (const style of effectStyles) {
    if (style.effects.length === 0) continue;
    const values = style.effects.map(shadowValue);
    const token = { $type: 'shadow', $value: values.length === 1 ? values[0] : values };
    if (style.description) token.$description = style.description;
    // ds.colorAlpha: one number, or one entry per effect (null = no alpha of its own) for a list.
    const alphas = style.effects.map((effect) => (effect.colorAlias && effect.color.a < 1 ? roundNumber(effect.color.a) : null));
    if (alphas.some((alpha) => alpha !== null)) token.$extensions = { 'ds.colorAlpha': alphas.length === 1 ? alphas[0] : alphas };
    insertToken(tree, style.name.split('/').map(toKebab).join('/'), token);
  }
  return tree;
}

export function writeTokens(raw, outDir) {
  const written = [];
  const brandCollection = raw.collections.find((collection) => toKebab(collection.name) === 'brand');
  const brandNames = brandCollection ? brandCollection.modes.map((mode) => toKebab(mode.name)) : [];
  for (const collection of raw.collections) {
    for (const mode of collection.modes) {
      const tree = {};
      for (const variable of collection.variables) {
        const token = buildToken(variable, mode.modeId, brandNames);
        if (token) insertToken(tree, variable.name, token);
      }
      const file = join(outDir, filePathFor(collection, mode));
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, `${JSON.stringify(tree, null, 2)}\n`);
      written.push(file);
    }
  }
  if (raw.effectStyles?.length > 0) {
    const file = join(outDir, 'effects.json');
    writeFileSync(file, `${JSON.stringify(effectTokens(raw.effectStyles), null, 2)}\n`);
    written.push(file);
  }
  return written;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [exportFile, outDir = 'tokens'] = process.argv.slice(2);
  if (!exportFile) {
    console.error('Usage: node scripts/sync/write-tokens.mjs <figma-export.json> [outDir]');
    process.exit(1);
  }
  const files = writeTokens(JSON.parse(readFileSync(exportFile, 'utf8')), outDir);
  console.log(`Wrote ${files.length} token files:\n${files.map((file) => `  ${file}`).join('\n')}`);
}
