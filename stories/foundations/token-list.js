// Reads the DTCG token files into flat lists for the Foundations pages.
// Names follow the token build: $extensions["ds.cssName"] if set, else the path joined with "-".
import dcc from '../../tokens/brands/dcc.json';
import desktop from '../../tokens/breakpoint/desktop.json';
import light from '../../tokens/semantic/light.json';

function flatten(tree, path = []) {
  if (tree && typeof tree === 'object' && '$value' in tree) {
    return [{
      path: path.join('.'),
      name: `--${tree.$extensions?.['ds.cssName'] ?? path.join('-')}`,
      type: tree.$type,
      alias: typeof tree.$value === 'string' && tree.$value.startsWith('{') ? tree.$value : null,
      description: tree.$description ?? '',
    }];
  }
  return Object.entries(tree).flatMap(([key, child]) => (key.startsWith('$') ? [] : flatten(child, [...path, key])));
}

// Every brand has the same token names (tokens:check guarantees it), so DCC's file gives the list;
// the values shown are read from the page for the brand picked in the toolbar.
export const brandTokens = flatten(dcc);
export const semanticTokens = flatten(light);
export const breakpointTokens = flatten(desktop);

export const byPrefix = (tokens, prefix) => tokens.filter((token) => token.path.startsWith(`${prefix}.`));

export function groupBy(tokens, depth) {
  const groups = new Map();
  for (const token of tokens) {
    const key = token.path.split('.').slice(0, depth).join('.');
    groups.set(key, [...(groups.get(key) ?? []), token]);
  }
  return groups;
}
