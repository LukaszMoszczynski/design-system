// @vitest-environment happy-dom
// PHP twins print exactly the HTML of their template.js for every arg set the stories use (scripts/php-parity.mjs).
// Needs Docker (php:8.4-cli); without it the test is skipped with a notice.
import { describe, expect, it, vi } from 'vitest';
import { existsSync } from 'node:fs';
import { collectCases, compareCases, componentOf, dockerAvailable, renderInJs, renderInPhp, templateFiles } from '../scripts/php-parity.mjs';

const DOCKER = dockerAvailable();
if (!DOCKER) console.warn('[php-parity] Docker is not available: the PHP twin parity test is skipped.');

describe('template files', () => {
  it('every template.js has a PHP twin', () => {
    const files = templateFiles();
    expect(files.length).toBeGreaterThan(40);
    const missing = files.filter((file) => !existsSync(file.replace(/\.template\.js$/, '.template.php')));
    expect(missing, `no PHP twin for:\n${missing.join('\n')}`).toEqual([]);
  });
});

describe.skipIf(!DOCKER)('PHP twin parity', () => {
  it('renders every story arg set identically in JS and PHP', async () => {
    const cases = await collectCases({ vi });
    const covered = new Set(cases.map((entry) => entry.file));
    const uncovered = templateFiles().filter((file) => !covered.has(file));
    expect(uncovered, `no cases for:\n${uncovered.join('\n')}`).toEqual([]);

    const jsOutputs = await renderInJs(cases, { vi });
    const phpOutputs = renderInPhp(cases);
    const failures = compareCases(cases, jsOutputs, phpOutputs);
    const components = new Set(cases.map((entry) => componentOf(entry.file)));
    console.info(`[php-parity] ${cases.length} cases, ${components.size} components, ${failures.length} differences`);
    expect(failures, `component · story · first differing line\n${failures.join('\n')}`).toEqual([]);
  }, 600000);
});
