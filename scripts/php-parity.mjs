// PHP twin parity: every components/**/<name>.template.js has a <name>.template.php that must print the same HTML.
//
// 1. collectCases({ vi }): imports every stories file with each template module wrapped, renders every story (Playground,
//    Overview, examples) with its merged args and records every call of an exported render* function: its file, its name
//    and its args (a JSON copy, the same input the PHP side gets). Nested calls count too (a button inside a card), so a
//    molecule's args to its atoms are checked as well. An exported render* function no story calls gets one case with {}.
//    The stories import CSS-free modules, but .storybook/state.js needs a DOM, so this runs inside Vitest (happy-dom)
//    and needs Vitest's `vi` for the module wrapping.
// 2. renderInJs(cases, { vi }): fresh, unwrapped template modules render every case in order.
// 3. renderInPhp(cases): one `docker run php:8.4-cli php /app/scripts/php-render.php --batch` renders the same cases in
//    the same order (so module state such as the circular badge's path counter lines up).
// 4. compareCases(): exact string comparison after normalising only whitespace between tags.
//
// Run: `npm run test:php` (tests/php-parity.test.js). `node scripts/php-parity.mjs` runs that test.
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { globFiles } from './glob-files.mjs';

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const PHP_IMAGE = 'php:8.4-cli';

export function templateFiles() {
  return globFiles('components/**/*.template.js').sort();
}

export function storiesFiles() {
  return globFiles('components/**/*.stories.js').sort();
}

// `components/atoms/button/button.template.js` → `atoms/button`.
export function componentOf(file) {
  return file.replace(/^components\//, '').replace(/\/[^/]+\.template\.js$/, '');
}

const absolute = (file) => resolve(REPO_ROOT, file).replaceAll('\\', '/');
const jsonCopy = (value) => JSON.parse(JSON.stringify(value ?? {}));

// Only whitespace between tags is normalised; text, attributes and entities must match exactly.
export function normalise(html) {
  return String(html).replace(/>\s+</g, '><').trim();
}

export function dockerAvailable() {
  const result = spawnSync('docker', ['info', '--format', '{{.ServerVersion}}'], { encoding: 'utf8', timeout: 20000 });
  return result.status === 0 && Boolean(result.stdout.trim());
}

export async function collectCases({ vi }) {
  const cases = [];
  const seen = new Map();
  let currentStory = '';

  const record = (file, exportName, args) => {
    let copy;
    try {
      copy = jsonCopy(args);
    } catch {
      return; // not JSON (never the case in the stories today); such a call cannot reach PHP anyway
    }
    const key = `${file}|${exportName}|${JSON.stringify(copy)}`;
    if (seen.has(key)) return;
    seen.set(key, true);
    cases.push({ component: componentOf(file), file, exportName, args: copy, story: currentStory });
  };

  const files = templateFiles();
  for (const file of files) {
    vi.doMock(absolute(file), async (importOriginal) => {
      const original = await importOriginal();
      const wrapped = { ...original };
      for (const [name, value] of Object.entries(original)) {
        if (typeof value === 'function' && /^render[A-Z]/.test(name)) {
          wrapped[name] = (...callArgs) => {
            record(file, name, callArgs[0]);
            return value(...callArgs);
          };
        }
      }
      return wrapped;
    });
  }

  for (const file of storiesFiles()) {
    const stories = await import(/* @vite-ignore */ pathToFileURL(absolute(file)).href);
    const meta = stories.default ?? {};
    for (const [exportName, story] of Object.entries(stories)) {
      if (exportName === 'default' || !story || typeof story !== 'object') continue;
      const render = story.render ?? meta.render;
      if (typeof render !== 'function') continue;
      const args = { ...(meta.args ?? {}), ...(story.args ?? {}) };
      currentStory = `${meta.title ?? file} · ${story.name ?? exportName}`;
      render(args, { args, globals: {}, parameters: { ...(meta.parameters ?? {}), ...(story.parameters ?? {}) }, id: currentStory });
    }
  }

  // Exported render functions no story reaches still get their defaults checked.
  for (const file of files) {
    vi.doUnmock(absolute(file));
  }
  vi.resetModules();
  for (const file of files) {
    const module = await import(/* @vite-ignore */ pathToFileURL(absolute(file)).href);
    for (const [name, value] of Object.entries(module)) {
      if (typeof value !== 'function' || !/^render[A-Z]/.test(name)) continue;
      if (!cases.some((entry) => entry.file === file && entry.exportName === name)) {
        currentStory = '(defaults, no story calls it)';
        record(file, name, {});
      }
    }
  }
  return cases;
}

// Renders in fresh, unwrapped modules, in the order of `cases`.
export async function renderInJs(cases, { vi }) {
  vi.resetModules();
  const modules = new Map();
  const outputs = [];
  for (const entry of cases) {
    if (!modules.has(entry.file)) modules.set(entry.file, await import(/* @vite-ignore */ pathToFileURL(absolute(entry.file)).href));
    try {
      outputs.push({ html: modules.get(entry.file)[entry.exportName](jsonCopy(entry.args)) });
    } catch (error) {
      outputs.push({ error: `JS threw: ${error.message}` });
    }
  }
  return outputs;
}

export function renderInPhp(cases) {
  const input = JSON.stringify(cases.map(({ component, exportName, args }) => ({ component, function: exportName, args })));
  const result = spawnSync(
    'docker',
    ['run', '--rm', '-i', '-v', `${REPO_ROOT}:/app`, PHP_IMAGE, 'php', '/app/scripts/php-render.php', '--batch'],
    { input, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, timeout: 600000, env: { ...process.env, MSYS_NO_PATHCONV: '1' } },
  );
  if (result.status !== 0) {
    throw new Error(`php-render.php failed (exit ${result.status}): ${result.stderr || result.stdout || result.error}`);
  }
  return JSON.parse(result.stdout);
}

// The first line that differs, with the HTML split at tag boundaries so a line is one tag or one text.
export function firstDifference(expected, actual) {
  const lines = (html) => normalise(html).replace(/></g, '>\n<').split('\n');
  const expectedLines = lines(expected);
  const actualLines = lines(actual);
  const length = Math.max(expectedLines.length, actualLines.length);
  for (let index = 0; index < length; index += 1) {
    if (expectedLines[index] !== actualLines[index]) {
      return `line ${index + 1}: JS ${JSON.stringify(expectedLines[index] ?? '(end)')} ≠ PHP ${JSON.stringify(actualLines[index] ?? '(end)')}`;
    }
  }
  return '';
}

export function compareCases(cases, jsOutputs, phpOutputs) {
  const failures = [];
  cases.forEach((entry, index) => {
    const label = `${entry.component} (${entry.exportName}) · ${entry.story}`;
    const js = jsOutputs[index];
    const php = phpOutputs[index] ?? { error: 'no PHP output' };
    if (js.error) failures.push(`${label} · ${js.error}`);
    else if (php.error) failures.push(`${label} · PHP: ${php.error}`);
    else if (normalise(js.html) !== normalise(php.html)) failures.push(`${label} · ${firstDifference(js.html, php.html)}`);
  });
  return failures;
}

// `node scripts/php-parity.mjs`: run the parity test (the stories need Vitest's DOM).
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const run = spawnSync('npx', ['vitest', 'run', 'tests/php-parity.test.js'], { cwd: REPO_ROOT, stdio: 'inherit', shell: process.platform === 'win32' });
  process.exit(run.status ?? 1);
}
