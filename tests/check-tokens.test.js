import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { checkTokens } from '../scripts/check-tokens.mjs';

const color = (value) => ({ $type: 'color', $value: value });
const dimension = (value) => ({ $type: 'dimension', $value: value });

const completeSet = () => ({
  'brands/dcc.json': { palette: { primary: { 600: color('#1269b0') } }, radius: { lg: dimension('16px') } },
  'brands/omelanski.json': { palette: { primary: { 600: color('#2a5db0') } }, radius: { lg: dimension('11px') } },
  'semantic/light.json': { color: { brand: { primary: color('{palette.primary.600}') } } },
  'semantic/dark.json': { color: { brand: { primary: color('{palette.primary.600}') } } },
  'component.json': { button: { radius: dimension('{radius.lg}') } },
});

let directories = [];
function writeSet(files) {
  const dir = mkdtempSync(join(tmpdir(), 'check-'));
  directories.push(dir);
  for (const [file, content] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, file)), { recursive: true });
    writeFileSync(join(dir, file), JSON.stringify(content));
  }
  return dir;
}

afterEach(() => {
  directories.forEach((dir) => rmSync(dir, { recursive: true, force: true }));
  directories = [];
});

describe('checkTokens', () => {
  it('passes on a complete set', () => {
    expect(checkTokens(writeSet(completeSet())).errors).toEqual([]);
  });

  it('flags unresolved alias', () => {
    const files = completeSet();
    files['semantic/light.json'].color.brand.primary = color('{palette.primary.999}');
    const { errors } = checkTokens(writeSet(files));
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('color.brand.primary');
    expect(errors[0]).toContain('{palette.primary.999}');
  });

  it('flags token missing in one brand', () => {
    const files = completeSet();
    delete files['brands/omelanski.json'].radius;
    const { errors } = checkTokens(writeSet(files));
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('omelanski');
    expect(errors[0]).toContain('radius.lg');
  });

  it('flags an alias into a group that is not in the brand files or its own collection', () => {
    const files = completeSet();
    files['semantic/light.json'].color.surface = color('{component.thing}');
    files['component.json'].component = { thing: color('#000000') };
    const { errors } = checkTokens(writeSet(files));
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('color.surface');
  });

  it('allows aliasing a group of its own collection', () => {
    const files = completeSet();
    files['semantic/light.json'].color.text = color('{color.brand.primary}');
    expect(checkTokens(writeSet(files)).errors).toEqual([]);
  });
});
