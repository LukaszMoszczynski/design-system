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
});
