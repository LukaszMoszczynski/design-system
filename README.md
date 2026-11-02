# design-system

Multi-brand design system: Figma variables, DTCG tokens, Style Dictionary, Storybook.
Spec and plan are in `docs/`.

## Sync tokens

Figma (file `JfRuc3T6MhLuse40bo2g9W`) is the source of truth for tokens.

1. Export the variables: run `scripts/sync/figma-export.js` through the Figma MCP `use_figma` tool
   (read-only). Save the returned JSON to `tmp/figma-export.json` (gitignored).
   `use_figma` caps a return value at 48 KB, so export in several runs by setting `ONLY`
   (collection names) and `FROM`/`TO` (variable slice) at the top of the script, then merge the
   `collections` arrays.
2. `npm run sync:write` writes `tokens/**` (one DTCG file per collection mode).
3. `npm run tokens:check` verifies aliases resolve, every brand has the same tokens, and aliases
   only point at brand groups or their own collection.
4. `npm run tokens` builds the CSS from the tokens (added in the next task).
5. Commit the changed `tokens/` files.

## Scripts

- `npm test` runs the Vitest suite.
- `npm run sync:write`, `npm run tokens:check` as above.
