// Writes dist/component-map.json: every component folder tied to its Figma component (set) key(s), with the
// dependency closure of its template imports. Tasks that read the Figma file (the skill) look a library instance up here.
//
//   node scripts/component-map.mjs [path to figma-components.json]   (default tmp/figma-components.json, else the frozen test fixture)
//
// Shape: { "<figma set or component key>": { component, level, figmaName, keyed, primary, dependsOn, js, vendor } }
// keyed: 'figma' (key is a Figma key) or 'name' (a folder with no Figma component of its own: key is a readable name).
// - A folder can own several keys (button: Button, Button/Outline, Button/Arrow): one entry per key, exactly one has
//   primary: true (the first Figma id in the template's comment).
// - Keys come from scripts/sync/figma-components.js (component SET key for variants, component key otherwise); names are
//   kept only as figmaName, for the name fallback.
// - dependsOn = transitive closure of the `import ... .template.js` lines; the PHP twin's require_once lines must agree.
// - vendor = libraries ('swiper', 'gsap') used by the component's own JS or by anything in its closure.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { globFiles } from './glob-files.mjs';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LEVELS = { atoms: 'atom', molecules: 'molecule', organisms: 'organism', sections: 'section', base: 'base' };
const VENDOR_GLOBALS = { swiper: 'window.Swiper', gsap: 'window.gsap' };

const read = (file) => readFileSync(join(REPO_ROOT, file), 'utf8');
const folderOf = (file) => file.replace(/^components\//, '').replace(/\/[^/]+\.template\.(js|php)$/, '');
const nameOf = (folder) => folder.split('/').pop();

// `atoms/button`, `molecules/card-program`, `base`; sorted.
export function componentFolders() {
  return globFiles('components/**/*.template.js')
    .map((file) => folderOf(file))
    .filter((folder) => !folder.startsWith('_'))
    .sort();
}

// Resolves './x/y.template.(js|php)' written inside `folder` to the component folder it points at.
function targetFolder(folder, path) {
  const absolute = resolve(REPO_ROOT, 'components', folder, path);
  const relative = absolute.replaceAll('\\', '/').slice(resolve(REPO_ROOT, 'components').replaceAll('\\', '/').length + 1);
  return folderOf(`components/${relative}`);
}

function dependenciesIn(folder, extension, pattern) {
  const source = read(`components/${folder}/${nameOf(folder)}.template.${extension}`);
  const found = [...source.matchAll(pattern)].map((match) => targetFolder(folder, match[1]));
  return [...new Set(found)].filter((target) => target !== folder).sort();
}

// Direct dependencies from the `import ... from '<path>.template.js'` lines (shared helpers are not components).
export function directDependencies(folder) {
  return dependenciesIn(folder, 'js', /from\s+'([^']+\.template\.js)'/g);
}

// The same from the PHP twin's `require_once __DIR__ . '<path>.template.php'` lines.
export function phpDependencies(folder) {
  return dependenciesIn(folder, 'php', /require_once\s+__DIR__\s*\.\s*'\/?([^']+\.template\.php)'/g);
}

function closure(folder, seen = new Set()) {
  for (const dependency of directDependencies(folder)) {
    if (!seen.has(dependency)) {
      seen.add(dependency);
      closure(dependency, seen);
    }
  }
  return [...seen].sort();
}

function ownVendors(folder) {
  const file = `components/${folder}/${nameOf(folder)}.js`;
  if (!existsSync(join(REPO_ROOT, file))) return [];
  const source = read(file);
  return Object.entries(VENDOR_GLOBALS)
    .filter(([, global]) => source.includes(global))
    .map(([vendor]) => vendor);
}

// Figma ids quoted in the template's leading `Figma:` comment (up to the `DCC:` note), in order of appearance.
export function figmaIds(folder) {
  const source = read(`components/${folder}/${nameOf(folder)}.template.js`);
  const lines = source.split('\n');
  const start = lines.findIndex((line) => line.startsWith('//') && line.includes('Figma'));
  if (start === -1) return [];
  const block = [];
  for (const line of lines.slice(start)) {
    if (!line.startsWith('//')) break;
    block.push(line.slice(2));
  }
  const text = block.join(' ');
  const comment = text.slice(text.indexOf('Figma'));
  const end = comment.indexOf('DCC:');
  return [...(end === -1 ? comment : comment.slice(0, end)).matchAll(/\b(\d+:\d+)\b/g)].map((match) => match[1]);
}

// Ties the comment cannot give: atoms/icon draws the glyphs of these Figma icon sets (3:13 chevrons, 3:19 plus/minus,
// 3:4 arrow diagonal), which are not cited in its comment.
const EXTRA_IDS = { 'atoms/icon': ['3:13', '3:19', '3:4'] };

// Folders with no Figma component of their own (a part of another component, or page defaults): keyed by name.
const NAME_KEYED = {
  base: { key: 'base', figmaName: null },
  'molecules/benefits': { key: 'Benefits', figmaName: 'Benefits' },
  'molecules/numbered-list': { key: 'Numbered list', figmaName: 'Numbered list' },
};

// Which folder owns which Figma item. A set/component quoted by two templates stays with the folder that quotes it
// first, unless OWNER_OVERRIDES says otherwise (the sections reuse atoms/molecules in their comments).
const OWNER_OVERRIDES = {};

export function tieFolders(figma, folders = componentFolders()) {
  const items = [...figma.sets, ...figma.components];
  const byId = new Map(items.map((item) => [item.id, item]));
  const owner = new Map();
  const ties = new Map(folders.map((folder) => [folder, []]));
  const unresolved = [];
  for (const folder of folders) {
    for (const id of [...figmaIds(folder), ...(EXTRA_IDS[folder] ?? [])]) {
      const item = byId.get(id);
      if (!item) {
        unresolved.push({ folder, id });
        continue;
      }
      const override = OWNER_OVERRIDES[item.key];
      if (override && override !== folder) continue;
      if (owner.has(item.key) && owner.get(item.key) !== folder) continue;
      if (!owner.has(item.key)) {
        owner.set(item.key, folder);
        ties.get(folder).push(item);
      }
    }
  }
  return { ties, unresolved, owner };
}

export function buildComponentMap({ figma }) {
  const folders = componentFolders();
  const { ties } = tieFolders(figma, folders);
  const map = {};
  for (const folder of folders) {
    const closureFolders = closure(folder);
    const vendor = [...new Set([folder, ...closureFolders].flatMap((member) => ownVendors(member)))].sort();
    const js = existsSync(join(REPO_ROOT, `components/${folder}/${nameOf(folder)}.js`));
    const items = ties.get(folder);
    // The primary entry is the item named like the folder (Breadcrumbs, Social button), else the first id of the comment.
    const normalise = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, '');
    const named = items.findIndex((item) => normalise(item.name.split('/').pop()) === normalise(nameOf(folder)) || normalise(item.name) === normalise(nameOf(folder)));
    const primaryIndex = Math.max(named, 0);
    if (items.length === 0 && NAME_KEYED[folder]) {
      const { key, figmaName } = NAME_KEYED[folder];
      map[key] = { component: folder, level: LEVELS[folder.split('/')[0]], figmaName, keyed: 'name', primary: true, dependsOn: closureFolders, js, vendor };
    }
    items.forEach((item, index) => {
      map[item.key] = {
        component: folder,
        level: LEVELS[folder.split('/')[0]],
        figmaName: item.name,
        keyed: 'figma',
        primary: index === primaryIndex,
        dependsOn: closureFolders,
        js,
        vendor,
      };
    });
  }
  return map;
}

function main() {
  const given = process.argv[2];
  const fixture = join(REPO_ROOT, 'tests/fixtures/figma-components.json');
  const exported = join(REPO_ROOT, 'tmp/figma-components.json');
  const source = given ? resolve(given) : existsSync(exported) ? exported : fixture;
  const figma = JSON.parse(readFileSync(source, 'utf8'));
  const folders = componentFolders();
  const { ties, unresolved } = tieFolders(figma, folders);
  const map = buildComponentMap({ figma });
  mkdirSync(join(REPO_ROOT, 'dist'), { recursive: true });
  writeFileSync(join(REPO_ROOT, 'dist/component-map.json'), `${JSON.stringify(map, null, 2)}\n`);

  const untied = folders.filter((folder) => ties.get(folder).length === 0);
  const nameKeyed = untied.filter((folder) => NAME_KEYED[folder]);
  const claimed = new Set(Object.keys(map));
  const withoutFolder = [...figma.sets, ...figma.components].filter((item) => !claimed.has(item.key));
  console.log(`component-map: ${Object.keys(map).length} keys for ${folders.length} folders (${nameKeyed.length} keyed by name) (from ${source})`);
  if (untied.length) console.log(`folders without a Figma key: ${untied.join(', ')}`);
  const unmapped = untied.filter((folder) => !NAME_KEYED[folder]);
  if (unmapped.length) process.exitCode = 1;
  console.log(`Figma sets/components without a folder (${withoutFolder.length}): ${withoutFolder.map((item) => `${item.name} (${item.id})`).join(', ')}`);
  if (unresolved.length) console.log(`ids in comments not found as set/component: ${unresolved.map((item) => `${item.folder} ${item.id}`).join(', ')}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
