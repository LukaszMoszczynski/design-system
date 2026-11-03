// Node side: brands are the files in <root>/tokens/brands/*.json (what `npm run sync:write` creates).
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { brandNamesFromPaths } from './brands.mjs';

export function listBrands(root = '.') {
  return brandNamesFromPaths(readdirSync(join(root, 'tokens', 'brands')).filter((file) => file.endsWith('.json')));
}
