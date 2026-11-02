import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeTokens } from '../scripts/sync/write-tokens.mjs';

const raw = JSON.parse(readFileSync(new URL('./fixtures/figma-export.sample.json', import.meta.url), 'utf8'));
const read = (dir, file) => JSON.parse(readFileSync(join(dir, file), 'utf8'));

describe('writeTokens', () => {
  let dir;
  let written;
  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), 'tokens-'));
    written = writeTokens(raw, dir);
  });

  it('writes one file per brand mode', () => {
    expect(existsSync(join(dir, 'brands/dcc.json'))).toBe(true);
    expect(existsSync(join(dir, 'brands/omelanski.json'))).toBe(true);
    expect(written).toHaveLength(4);
  });

  it('converts colour to hex', () => {
    expect(read(dir, 'brands/dcc.json').palette.primary['600']).toEqual({ $type: 'color', $value: '#1269b0' });
    expect(read(dir, 'brands/omelanski.json').palette.primary['600'].$value).toBe('#ff000080');
  });

  it('writes aliases as DTCG references', () => {
    expect(read(dir, 'semantic/light.json').color.brand.primary.$value).toBe('{palette.primary.600}');
  });

  it('writes FLOAT radius as px', () => {
    expect(read(dir, 'brands/dcc.json').radius.lg).toEqual({ $type: 'dimension', $value: '16px' });
  });

  it('writes font weight as a number and font family as fontFamily', () => {
    const dcc = read(dir, 'brands/dcc.json');
    expect(dcc.font.weight.bold.$value).toBe(700);
    expect(dcc.font.family.heading.$type).toBe('fontFamily');
  });

  it('keeps placeholder descriptions', () => {
    expect(read(dir, 'brands/omelanski.json').font.family.heading.$description).toBe('placeholder');
  });

  describe("with hand-made variables", () => {
    const rawWith = (variables) => ({
      collections: [{ name: "Brand", modes: [{ modeId: "1:0", name: "DCC" }, { modeId: "1:1", name: "Other" }], variables }],
    });
    const variable = (name, type, codeSyntax, value) => ({
      name, type, codeSyntax, description: "", valuesByMode: { "1:0": value, "1:1": value },
    });
    const writeOne = (variables) => {
      const out = mkdtempSync(join(tmpdir(), "tokens-"));
      writeTokens(rawWith(variables), out);
      return read(out, "brands/dcc.json");
    };

    it("writes ds.cssName only when the code syntax is a plain var(--x) that differs from the path", () => {
      const tokens = writeOne([
        variable("font/family/heading", "STRING", "var(--font-heading)", "Ubuntu"),
        variable("radius/lg", "FLOAT", "var(--radius-lg)", 16),
        variable("radius/md", "FLOAT", "", 12),
        variable("hero/min-height", "FLOAT", "min-height: 800px", 800),
      ]);
      expect(tokens.font.family.heading.$extensions).toEqual({ "ds.cssName": "font-heading" });
      expect(tokens.radius.lg.$extensions).toBeUndefined();
      expect(tokens.radius.md.$extensions).toBeUndefined();
      expect(tokens.hero["min-height"].$extensions).toBeUndefined();
    });

    it("ignores a code syntax that starts with a brand name and falls back to the path", () => {
      const tokens = writeOne([
        variable("field/radius", "FLOAT", "var(--dcc-radius-md)", 12),
        variable("social/size", "FLOAT", "var(--other-social-size)", 44),
        variable("radius/lg", "FLOAT", "var(--radius-big)", 16),
      ]);
      expect(tokens.field.radius.$extensions).toBeUndefined();
      expect(tokens.social.size.$extensions).toBeUndefined();
      expect(tokens.radius.lg.$extensions).toEqual({ "ds.cssName": "radius-big" });
    });

    it("maps STRING font weights to fontWeight numbers", () => {
      const tokens = writeOne([
        variable("font/weight/regular", "STRING", "", "Regular"),
        variable("font/weight/medium", "STRING", "", "Medium"),
        variable("font/weight/bold", "STRING", "", "Bold"),
      ]);
      expect(tokens.font.weight.regular).toEqual({ $type: "fontWeight", $value: 400 });
      expect(tokens.font.weight.medium).toEqual({ $type: "fontWeight", $value: 500 });
      expect(tokens.font.weight.bold).toEqual({ $type: "fontWeight", $value: 700 });
    });

    it("throws on an unknown font weight", () => {
      expect(() => writeOne([variable("font/weight/odd", "STRING", "", "Wobbly")])).toThrow(/Unknown font weight/);
    });

    it("throws on an unsupported STRING variable", () => {
      expect(() => writeOne([variable("label/text", "STRING", "", "Hi")])).toThrow(/Unsupported STRING/);
    });
  });
});

describe('writeTokens effect styles', () => {
  const shadow = (overrides = {}) => ({
    type: 'DROP_SHADOW', offsetX: 0, offsetY: 12, blur: 32, spread: 0,
    color: { r: 0.2157, g: 0.149, b: 0.3843, a: 1 }, colorAlias: 'Semantic/color/shadow', ...overrides,
  });
  const writeEffects = (effectStyles) => {
    const out = mkdtempSync(join(tmpdir(), 'tokens-'));
    const written = writeTokens({ collections: [], effectStyles }, out);
    return { written, tokens: read(out, 'effects.json') };
  };

  it('writes effects.json with a DTCG shadow token whose bound colour is an alias', () => {
    const { written, tokens } = writeEffects([{ name: 'Shadow/Card', description: 'Card shadow', effects: [shadow()] }]);
    expect(written.at(-1)).toMatch(/effects\.json$/);
    expect(tokens.shadow.card).toEqual({
      $type: 'shadow',
      $value: { color: '{color.shadow}', offsetX: '0px', offsetY: '12px', blur: '32px', spread: '0px' },
      $description: 'Card shadow',
    });
  });

  it('writes a bound colour as a plain alias: its alpha lives in the variable', () => {
    const { tokens } = writeEffects([{ name: 'Shadow/Soft', description: '', effects: [shadow({ color: { r: 0, g: 0, b: 0, a: 0.08 } })] }]);
    expect(tokens.shadow.soft.$value.color).toBe('{color.shadow}');
    expect(tokens.shadow.soft.$extensions).toBeUndefined();
  });

  it('writes an unbound colour as hex, inner shadows as inset, and several effects as a list', () => {
    const { tokens } = writeEffects([{
      name: 'Shadow/Double',
      description: '',
      effects: [shadow({ colorAlias: null, color: { r: 0, g: 0, b: 0, a: 0.5 } }), shadow({ type: 'INNER_SHADOW', offsetY: 2, blur: 4 })],
    }]);
    expect(tokens.shadow.double.$value).toEqual([
      { color: '#00000080', offsetX: '0px', offsetY: '12px', blur: '32px', spread: '0px' },
      { color: '{color.shadow}', offsetX: '0px', offsetY: '2px', blur: '4px', spread: '0px', inset: true },
    ]);
  });

  it('writes no effects.json when the export has no effect styles', () => {
    const out = mkdtempSync(join(tmpdir(), 'tokens-'));
    writeTokens({ collections: [] }, out);
    expect(existsSync(join(out, 'effects.json'))).toBe(false);
  });
});

describe('synced tokens', () => {
  const tokensDir = new URL('../tokens/', import.meta.url);
  const semantic = (mode) => JSON.parse(readFileSync(new URL(`semantic/${mode}.json`, tokensDir), 'utf8'));

  it('semantic light has the card and lift shadow colours with alpha (8-digit hex)', () => {
    expect(semantic('light').color['shadow-card'].$value).toMatch(/^#[0-9a-f]{8}$/);
    expect(semantic('light').color['shadow-lift'].$value).toMatch(/^#[0-9a-f]{8}$/);
  });

  it('effects alias the shadow colours that carry the alpha', () => {
    const effects = JSON.parse(readFileSync(new URL('effects.json', tokensDir), 'utf8'));
    expect(effects.shadow.card.$value.color).toBe('{color.shadow-card}');
    expect(effects.shadow.lift.$value.color).toBe('{color.shadow-lift}');
  });
});
