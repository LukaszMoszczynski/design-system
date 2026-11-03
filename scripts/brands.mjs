// One place that turns file paths into the brand list. Pure (no node imports), so Storybook (Vite) can use it too.

/** 'dist/tokens/dcc.css' or 'tokens/brands/dcc.json' -> 'dcc'; shared.css is not a brand. */
export function brandNamesFromPaths(paths) {
  return paths
    .map((path) => path.split(/[\/]/).at(-1).replace(/\.(css|json)$/, ''))
    .filter((name) => name !== 'shared')
    .sort();
}

/** Toolbar title: brand.json `title`, else the capitalised folder name. */
export function brandTitle(name, titles = {}) {
  return titles[name] ?? name.charAt(0).toUpperCase() + name.slice(1);
}
