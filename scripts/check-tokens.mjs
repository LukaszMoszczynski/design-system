// Validates the DTCG token files written by scripts/sync/write-tokens.mjs.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const WHOLE_ALIAS = /^\{([^{}]+)\}$/;
// Collections that may also alias another collection's groups: shadows take their colour from Semantic.
const EXTRA_ALIAS_COLLECTIONS = { effects: ['semantic'] };

// Whole-value aliases in a token value, including inside composite values (shadow objects and lists).
function aliasesIn(value) {
  if (typeof value === 'string') return WHOLE_ALIAS.test(value) ? [value] : [];
  if (value && typeof value === 'object') return Object.values(value).flatMap(aliasesIn);
  return [];
}

function listJsonFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return listJsonFiles(full);
    return entry.name.endsWith('.json') ? [full] : [];
  });
}

function flatten(node, prefix = []) {
  const tokens = new Map();
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    if (child && typeof child === 'object' && '$value' in child) tokens.set([...prefix, key].join('.'), child);
    else if (child && typeof child === 'object') {
      for (const [path, token] of flatten(child, [...prefix, key])) tokens.set(path, token);
    }
  }
  return tokens;
}

// "brands/dcc.json" -> collection "brands", "component.json" -> collection "component"
function collectionOf(relativeFile) {
  const [first] = relativeFile.split('/');
  return first.replace(/\.json$/, '');
}

export function checkTokens(dir) {
  const errors = [];
  const files = listJsonFiles(dir).map((full) => {
    const name = relative(dir, full).split(sep).join('/');
    return { name, collection: collectionOf(name), tokens: flatten(JSON.parse(readFileSync(full, 'utf8'))) };
  });

  const allPaths = new Set(files.flatMap((file) => [...file.tokens.keys()]));
  const topGroup = (path) => path.split('.')[0];
  const brandFiles = files.filter((file) => file.collection === 'brands');
  const brandGroups = new Set(brandFiles.flatMap((file) => [...file.tokens.keys()].map(topGroup)));

  const groupsByCollection = new Map();
  for (const file of files) {
    const groups = groupsByCollection.get(file.collection) ?? new Set();
    for (const path of file.tokens.keys()) groups.add(topGroup(path));
    groupsByCollection.set(file.collection, groups);
  }

  for (const file of files) {
    const extraGroups = (EXTRA_ALIAS_COLLECTIONS[file.collection] ?? []).flatMap((collection) => [...(groupsByCollection.get(collection) ?? [])]);
    const allowedGroups = new Set([...brandGroups, ...groupsByCollection.get(file.collection), ...extraGroups]);
    for (const [path, token] of file.tokens) {
      for (const reference of aliasesIn(token.$value)) {
        const target = WHOLE_ALIAS.exec(reference)[1];
        if (!allPaths.has(target)) {
          errors.push(`${file.name}: ${path} aliases ${reference}, which does not resolve`);
        } else if (!allowedGroups.has(topGroup(target))) {
          errors.push(`${file.name}: ${path} aliases ${reference}; "${topGroup(target)}" is not a brand group or a group of its own collection`);
        }
      }
    }
  }

  const brandPaths = new Set(brandFiles.flatMap((file) => [...file.tokens.keys()]));
  for (const file of brandFiles) {
    for (const path of brandPaths) {
      if (!file.tokens.has(path)) errors.push(`${file.name}: missing token ${path} that another brand has`);
    }
  }

  return { errors };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const dir = process.argv[2] ?? 'tokens';
  const { errors } = checkTokens(dir);
  if (errors.length > 0) {
    console.error(`${errors.length} token error(s):\n${errors.map((error) => `  ${error}`).join('\n')}`);
    process.exit(1);
  }
  console.log(`Tokens in ${dir} are consistent.`);
}
