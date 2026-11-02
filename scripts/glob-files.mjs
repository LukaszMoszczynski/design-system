// Minimal glob for the guards: supports `**` (any folders) and `*` (within one name). Returns forward-slash paths.
// Written by hand because fs.globSync still prints an ExperimentalWarning on Node 22.
import { existsSync, readdirSync } from 'node:fs';

export function globFiles(pattern) {
  const normalized = pattern.replaceAll('\\', '/');
  const parts = normalized.split('/');
  const wildcard = parts.findIndex((part) => part.includes('*'));
  if (wildcard === -1) return existsSync(normalized) ? [normalized] : [];
  const root = parts.slice(0, wildcard).join('/') || '.';
  if (!existsSync(root)) return [];
  const source = normalized
    .split('**/')
    .map((piece) => piece.replace(/[.+?^${}()|[\]]/g, '\\$&').replaceAll('*', '[^/]*'))
    .join('(?:.*/)?');
  const matcher = new RegExp(`^${source}$`);
  return readdirSync(root, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile())
    .map((entry) => `${entry.parentPath.replaceAll('\\', '/')}/${entry.name}`.replace(/^\.\//, ''))
    .filter((file) => matcher.test(file));
}
