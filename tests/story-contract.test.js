// Story contract: a stories file never exports `render` (CSF would treat it as a story); templates live in *.template.js.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { globFiles } from '../scripts/glob-files.mjs';

describe('story contract', () => {
  for (const file of globFiles('components/**/*.stories.js')) {
    it(`${file} does not export render`, () => {
      expect(readFileSync(file, 'utf8')).not.toMatch(/export\s+(?:const|function|let)\s+render\b|export\s*\{[^}]*\brender\b/);
    });
  }
});
