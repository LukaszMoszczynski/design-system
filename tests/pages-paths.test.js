// GitHub Pages serves the Storybook under /design-system/, so a root-absolute asset URL
// (url(/… or src="/…) in the static build would 404 there.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const STATIC_DIR = resolve(import.meta.dirname, '../storybook-static');
const TEXT_FILE = /\.(html|css|js|mjs|json|svg)$/;
const ABSOLUTE_URL = /url\(\s*['"]?\/(?!\/)|src="\/(?!\/)/;

function textFiles(dir) {
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && TEXT_FILE.test(entry.name) && !entry.name.endsWith('.map'))
    .map((entry) => join(entry.parentPath, entry.name));
}

describe('storybook-static', () => {
  it('has no absolute asset URLs in the static build', (context) => {
    if (!existsSync(STATIC_DIR)) context.skip('storybook-static is missing: run `npm run build-storybook` first');
    const offenders = textFiles(STATIC_DIR).filter((file) => ABSOLUTE_URL.test(readFileSync(file, 'utf8')));
    expect(offenders).toEqual([]);
  });
});
