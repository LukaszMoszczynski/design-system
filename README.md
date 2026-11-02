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
- `npm run storybook` starts Storybook on port 6006; `npm run build-storybook` writes `storybook-static/`.
- `npm run test-storybook -- --url http://127.0.0.1:6006` renders every story and runs the a11y check
  against a running Storybook. CI serves `storybook-static/` and runs it (`.github/workflows/pages.yml`).

## Storybook

Live at https://lukaszmoszczynski.github.io/design-system/, deployed on every push to `main`.

- Toolbar globals `brand` (`dcc` | `omelanski`) and `theme` (`light` | `dark`) set `data-brand` / `data-theme` on `<html>`.
- Brand fonts are self-hosted: `brands/<brand>/fonts.css` + `brands/<brand>/fonts/`.
- Component markup lives in `components/<level>/<name>/<name>.template.js`, which exports
  `render<PascalName>(args)` returning an HTML string; `<name>.stories.js` imports it.
- Placeholder images: `public/placeholders/*.svg`, referenced as `./placeholders/<name>.svg`.
