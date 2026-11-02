// Every family named in a brand's fonts.css must render Polish letters (ą U+0105, ł U+0142)
// from one of its own @font-face rules, and every font file it points at must exist.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const BRANDS_DIR = resolve(import.meta.dirname, '../brands');
const POLISH_LETTERS = [0x0105, 0x0142];

function parseFontFaces(css) {
  return [...css.matchAll(/@font-face\s*{([^}]*)}/g)].map(([, body]) => {
    const property = (name) => body.match(new RegExp(`${name}\\s*:\\s*([^;]+);`))?.[1].trim();
    return {
      family: property('font-family')?.replace(/['"]/g, ''),
      unicodeRange: property('unicode-range') ?? '',
      urls: [...body.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)].map((match) => match[1]),
    };
  });
}

function rangeCovers(unicodeRange, codePoint) {
  return unicodeRange.split(',').some((part) => {
    const [start, end = start] = part.trim().replace(/^U\+/i, '').split('-');
    return codePoint >= Number.parseInt(start, 16) && codePoint <= Number.parseInt(end, 16);
  });
}

const brandFontFiles = readdirSync(BRANDS_DIR)
  .map((brand) => join(BRANDS_DIR, brand, 'fonts.css'))
  .filter((file) => existsSync(file));

describe('brand fonts.css', () => {
  it('exists for dcc and omelanski', () => {
    expect(brandFontFiles.map((file) => file.split(/[\\/]/).at(-2)).sort()).toEqual(['dcc', 'omelanski']);
  });

  it.each(brandFontFiles)('every family in %s has a face covering ą and ł', (file) => {
    const faces = parseFontFaces(readFileSync(file, 'utf8'));
    const families = new Set(faces.map((face) => face.family));
    expect(families.size).toBeGreaterThan(0);
    for (const family of families) {
      const covered = POLISH_LETTERS.every((codePoint) =>
        faces.some((face) => face.family === family && rangeCovers(face.unicodeRange, codePoint)),
      );
      expect(covered, `${family} has no @font-face covering ą and ł`).toBe(true);
    }
  });

  it.each(brandFontFiles)('%s uses relative ./fonts/ URLs that exist', (file) => {
    for (const face of parseFontFaces(readFileSync(file, 'utf8'))) {
      for (const url of face.urls) {
        expect(url).toMatch(/^\.\/fonts\//);
        expect(existsSync(join(dirname(file), url)), url).toBe(true);
      }
    }
  });
});
