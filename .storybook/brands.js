// Brands come from the files, so adding one never edits a shared file:
//   dist/tokens/<brand>.css (built tokens), brands/<brand>/fonts.css, optional brands/<brand>/brand.json { "title": "…" }.
import { brandNamesFromPaths, brandTitle } from '../scripts/brands.mjs';

const tokenStyles = import.meta.glob('../dist/tokens/*.css', { eager: true });
import.meta.glob('../brands/*/fonts.css', { eager: true });
const brandFiles = import.meta.glob('../brands/*/brand.json', { eager: true, import: 'default' });

const titles = Object.fromEntries(
  Object.entries(brandFiles).map(([path, file]) => [path.split('/').at(-2), file.title]),
);

export const BRANDS = brandNamesFromPaths(Object.keys(tokenStyles));
export const BRAND_ITEMS = BRANDS.map((name) => ({ value: name, title: brandTitle(name, titles) }));
