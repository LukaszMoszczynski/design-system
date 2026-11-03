import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { buildComponentMap, componentFolders, directDependencies, phpDependencies } from '../scripts/component-map.mjs';

// The frozen Figma export (scripts/sync/figma-components.js) lets this run without Figma.
const figma = JSON.parse(readFileSync('tests/fixtures/figma-components.json', 'utf8'));
const map = buildComponentMap({ figma });
const entries = Object.entries(map);
const folders = componentFolders();

describe('component map', () => {
  it('every component folder appears, with exactly one primary entry', () => {
    expect(folders.length).toBeGreaterThan(40);
    for (const folder of folders) {
      const own = entries.filter(([, entry]) => entry.component === folder);
      expect(own.length, `${folder} has no Figma key`).toBeGreaterThan(0);
      expect(own.filter(([, entry]) => entry.primary), `${folder} primary entries`).toHaveLength(1);
    }
    expect(entries.every(([, entry]) => folders.includes(entry.component))).toBe(true);
  });

  it('keys are Figma component (set) keys from the export, each used once', () => {
    const known = new Set([...figma.sets, ...figma.components].map((item) => item.key));
    for (const [key, entry] of entries) {
      if (entry.keyed === 'name') continue; // a folder with no Figma component of its own
      expect(entry.keyed).toBe('figma');
      expect(known.has(key), `${key} (${entry.figmaName})`).toBe(true);
      expect(entry.figmaName).toBeTruthy();
    }
  });

  it('only folders without a Figma component of their own are keyed by name', () => {
    const byName = entries.filter(([, entry]) => entry.keyed === 'name').map(([, entry]) => entry.component).sort();
    expect(byName).toEqual(['base', 'molecules/benefits', 'molecules/numbered-list']);
  });

  it('has the shape Tasks 4 and 8 read', () => {
    for (const [, entry] of entries) {
      expect(['base', 'atom', 'molecule', 'organism', 'section']).toContain(entry.level);
      expect(Array.isArray(entry.dependsOn)).toBe(true);
      expect(typeof entry.js).toBe('boolean');
      expect(Array.isArray(entry.vendor)).toBe(true);
    }
  });

  it('dependsOn is the transitive closure of the template imports', () => {
    const byComponent = (name) => entries.find(([, entry]) => entry.component === name && entry.primary)[1];
    expect(byComponent('organisms/carousel').dependsOn).toContain('atoms/carousel-controls');
    expect(byComponent('organisms/carousel').dependsOn).toContain('atoms/icon');
    expect(byComponent('sections/testimonials').dependsOn).toContain('atoms/carousel-controls');
    expect(byComponent('atoms/icon').dependsOn).toEqual([]);
  });

  it('a component never depends on itself and the graph has no cycles', () => {
    const graph = new Map(folders.map((folder) => [folder, directDependencies(folder)]));
    const state = new Map();
    const visit = (folder, trail) => {
      if (state.get(folder) === 'done') return;
      expect(state.get(folder), `cycle: ${[...trail, folder].join(' -> ')}`).not.toBe('active');
      state.set(folder, 'active');
      for (const dependency of graph.get(folder)) visit(dependency, [...trail, folder]);
      state.set(folder, 'done');
    };
    for (const folder of folders) visit(folder, []);
    for (const [, entry] of entries) expect(entry.dependsOn).not.toContain(entry.component);
  });

  it('the PHP twin requires the same components as the JS template imports', () => {
    for (const folder of folders) {
      expect(phpDependencies(folder), folder).toEqual(directDependencies(folder));
    }
  });

  it('flags js and vendor libraries', () => {
    const byComponent = (name) => entries.find(([, entry]) => entry.component === name && entry.primary)[1];
    expect(byComponent('organisms/carousel')).toMatchObject({ js: true });
    expect(byComponent('organisms/carousel').vendor).toContain('swiper');
    expect(byComponent('organisms/header').vendor).toContain('gsap');
    expect(byComponent('atoms/button')).toMatchObject({ js: false, vendor: [] });
  });

  it('dist/component-map.json is current', () => {
    expect(existsSync('dist/component-map.json')).toBe(true);
    expect(JSON.parse(readFileSync('dist/component-map.json', 'utf8'))).toEqual(JSON.parse(JSON.stringify(map)));
  });
});
