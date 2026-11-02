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
