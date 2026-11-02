# Multi-brand Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A public GitHub repo `design-system` holding per-brand tokens synced from the Figma file "Atomic Design", plain HTML/CSS/vanilla-JS components (atoms → organisms + 4 sections) and a Storybook on GitHub Pages with Brand × Theme switching.

**Architecture:**
1. **Figma.** It gets a Brand collection with one mode per brand (DCC, Omelanski). The tokens are exported through the Figma MCP (`use_figma`) into DTCG JSON in `tokens/`.
2. **Style Dictionary.** It builds two kinds of CSS from that JSON. The first is one shared file: semantic Light/Dark, breakpoint and component tokens, all pointing at palette variables. The second is one file per brand that defines the palette. It also builds a per-brand `theme.json` fragment.
3. **Components.** Each component is one folder of CSS, optional classic-script JS and stories. They are rendered by `@storybook/html-vite`, and the brand/theme switch sets `data-brand` / `data-theme` on `<html>`.

**Tech Stack:**
- Node 22 and npm
- Style Dictionary 4 (DTCG)
- Storybook (latest major) with `@storybook/html-vite`, `@storybook/addon-a11y`, `storybook-addon-pseudo-states` and `@storybook/test-runner`
- Vitest + happy-dom
- Swiper 11
- GitHub Actions → GitHub Pages

**Spec:** `docs/superpowers/specs/2026-11-02-design-system-design.md`

## Global Constraints

- **Token names** are the Figma English names. A path `color/brand/primary` becomes the CSS property `--color-brand-primary`, and the JSON alias `{color.brand.primary}`.
- **Figma first.** Token values change only through the sync (Task 2). Nobody hand-edits `tokens/*.json` except through the sync script.
- **Brands:** `dcc` (brand 1, the reference look) and `omelanski` (a placeholder; close is enough).
- **Component CSS values:** only `var(--…)`, `color-mix()`, `0`, `1px`/`2px` hairlines, `%`, `fr`, unitless numbers, `currentColor`, `transparent`, `inherit`. There are no other hex/rgb/px/rem literals.
- **Class prefix** is `ds-` (BEM: `.ds-card-post__title`, `.ds-button--outline`). Selectors may not match `data-brand`. Brand-specific CSS is forbidden.
- **Component JS** uses classic scripts (no `import`). Each one registers `window.DS.<camelName> = { init(root = document) }`, auto-inits on `DOMContentLoaded`, and is idempotent: it marks each initialised element with `data-ds-ready`.
- **Breakpoints:** Mobile token set is `@media (max-width: 781px)`. Layout-only switches at `@media (max-width: 1024px)` live in component CSS.
- **Fluid type:** `clamp(min, calc(…vw), max)` between 375 px and 1200 px viewports, in both token CSS and theme.json.
- **Dark mode is opt-in:** only `:root[data-theme="dark"]`, with no `prefers-color-scheme`.
- **Carousels:** whole cards only on desktop, with no peeking next card (owner rule); a peek on phones is fine. Use Swiper, read from `window.Swiper`.
- **Default state is at rest.** Open/hover/active looks in Figma are examples (owner rule). Accordions start closed unless a story says otherwise.
- **Readable names in code:** `element`, `index`, `item`, never `e`/`i`/`p`.
- **Commits:** no `Co-Authored-By` or model trailers (owner rule).
- **Fonts** are self-hosted woff2 including `latin-ext`, because Polish text must render (ą ć ę ł ń ó ś ź ż).
- **Repo:** `github.com/LukaszMoszczynski/design-system`, public. Pages URL: `https://lukaszmoszczynski.github.io/design-system/`.

## Review Focus

1. **A hard-coded colour, size or font in component CSS.** With brand Omelanski selected, that part stays in DCC's look. Pinned by `scripts/check-css-values.mjs` (Task 5), which runs in `npm test`.
2. **A component reads a variable that one brand doesn't define.** It silently falls back to `initial`, so the brand switch breaks only for that brand. Pinned by `tests/token-usage.test.js` (Task 5), which checks every `var(--x)` in `components/**` against the built CSS of *each* brand.
3. **GitHub Pages serves under `/design-system/`.** Fonts, placeholder images or Swiper that use absolute `/…` URLs 404 there but not locally. Pinned by `tests/pages-paths.test.js` (Task 4), which scans `storybook-static` for `url(/` and `src="/`.
4. **Polish diacritics fall back to a system font** if only the `latin` subset ships. Pinned by `tests/fonts.test.js` (Task 4): every brand `fonts.css` declares a `latin-ext` `unicode-range` for each family it names.
5. **Component JS runs twice** (both auto-init and story/WordPress init, or two scripts on one page), which doubles listeners and breaks carousels/accordions. Pinned per component by an "init twice = one handler" test (helper in Task 5, used in Tasks 6–11).

---

## File Structure

```
design-system/
├── package.json                      scripts: sync:write, tokens, test, storybook, build-storybook
├── tokens/                           DTCG JSON written only by scripts/sync/write-tokens.mjs
│   ├── brands/dcc.json, brands/omelanski.json     Brand collection, one file per mode
│   ├── semantic/light.json, semantic/dark.json
│   ├── breakpoint/desktop.json, breakpoint/mobile.json
│   └── component.json
├── scripts/
│   ├── sync/figma-export.js          code run inside Figma via use_figma; returns raw variables JSON
│   ├── sync/write-tokens.mjs         raw export → tokens/*.json
│   ├── check-tokens.mjs              alias/brand completeness check
│   ├── check-css-values.mjs          no raw literals in components/**.css
│   └── build-tokens.mjs              Style Dictionary config + custom formats
├── dist/                             committed build output, for copying into sites
│   ├── tokens/shared.css, tokens/<brand>.css
│   └── wp/<brand>.theme.json
├── brands/<brand>/fonts/*.woff2, brands/<brand>/fonts.css
├── components/<level>/<name>/<name>.css | <name>.js | <name>.stories.js | README.md
├── .storybook/main.js, preview.js, manager.js, decorators.js
├── stories/foundations/*.mdx         Tokens docs pages
├── public/placeholders/*.svg         placeholder images (staticDirs)
├── tests/*.test.js, tests/helpers/load-script.js
└── .github/workflows/pages.yml
```

---

### Task 1: Figma — Brand collection with DCC and Omelanski modes

Read the `/figma-use` skill before the first `use_figma` call. File `JfRuc3T6MhLuse40bo2g9W`.

**Files:** none in the repo. Before/after screenshots go to the scratchpad.

**Interfaces:**
- Produces:
  - A Figma collection **`Brand`** with modes `DCC` and `Omelanski`. It holds the palette under role names, `font/family/*`, `radius/*`, `space/*`, `layout/container`, `layout/gutter-desktop` and `layout/gutter-mobile`.
  - Semantic, Breakpoint and Component alias it.
  - Each variable keeps its CSS code syntax.

**Palette rename** (same step numbers, so aliases only change name):

| Old (Primitives) | New (Brand) |
|---|---|
| `color/blue/{50,400,600,800}` | `palette/primary/{50,400,600,800}` |
| `color/violet/{50,100,600,700,800,900,950}` | `palette/secondary/{…same}` |
| `color/orange/{400,500}` | `palette/accent/{400,500}` |
| `color/gray/{50,100,400,600,900}` | `palette/neutral/{50,100,400,600,900}` |
| `color/white`, `color/black` | `palette/neutral/0`, `palette/neutral/1000` |

- [ ] **Step 1: Capture the before state.** Take `get_screenshot` of these nodes and save them to the scratchpad as `before-<id>.png`:
  - Tokens `16:2`
  - Button section on the Atoms page
  - Card/Program `8:113`
  - Carousel `12:807`
  - Header `28:1049`
  - Hero `81:314`
- [ ] **Step 2: Restructure.**
  - Rename the collection `Primitives` → `Brand` and its single mode → `DCC`.
  - Rename the variables per the table.
  - Move the font families, container width and gutters into `Brand`. The Breakpoint and Component variables that held them now alias the Brand ones.
  - Set the code syntax `var(--palette-primary-600)` etc. for the renamed variables.
- [ ] **Step 3: Verify that DCC is unchanged.** Re-screenshot the six nodes and compare them to Step 1. Expected: pixel-identical, apart from the label text on the Tokens page. If any frame differs, fix the alias before continuing.
- [ ] **Step 4: Add mode `Omelanski`** and fill it from `E:\projekty\omelanski\src\styles\tokens.css`:
  - **Colour:**
    - `primary/600 = #2a5db0`, `primary/400 = #8ab6f0`, `primary/800 = #1e4c96`, `primary/50 = #e5ecf7`.
    - `secondary/*` uses the ink navy scale: `950 = #12253d`, `900 = #172533`, `800 = #1f3145`, `700 = #101a22`. Lighter steps are tints of `#12253d`.
    - `accent/{400,500} = #009fe3`.
    - `neutral/0 = #fbf7f0`, `50 = #f6f0e6`, `100 = #efe7d9`, `400 = #7d756a`, `600 = #5b5246`, `900 = #2d2d2d`, `1000 = #000000`.
  - **Fonts:** heading `Barlow`, body `Source Serif 4`, mono `JetBrains Mono`.
  - **Layout:** container `1280`, gutters `40` / `18`.
  - **Radius:** each step is DCC's value minus about a third, rounded to a whole px, with `full` unchanged.
  - Steps with no Omelanski source keep the DCC value and get the variable description `placeholder`.
- [ ] **Step 5: Verify the switch.** On a duplicate of the Hero and Card/Program frames, set Brand = Omelanski and screenshot both. Expected: cream background, navy text, `#2a5db0` primary, serif body. Then delete the duplicates.
- [ ] **Step 6: Rewrite the "How to use this library for a new brand" text (`16:445`)** to say:
  1. In collection Brand, add a mode named after the brand.
  2. Fill every variable (palette, fonts, radius, layout).
  3. Set Brand = <mode> on a page frame to preview.
  4. Run "sync tokens" so the code gets `tokens/brands/<brand>.json`.
  5. Semantic, Breakpoint and Component never change per brand.

  Also rename the section `Colour · Primitives` → `Colour · Brand palette`.

---

### Task 2: Repo, token sync and token check

**Files:**
- Create:
  - `package.json`, `.gitignore`, `.nvmrc` (`22`), `README.md`
  - `scripts/sync/figma-export.js`, `scripts/sync/write-tokens.mjs`, `scripts/check-tokens.mjs`
  - `tokens/**`
- Test: `tests/write-tokens.test.js`, `tests/check-tokens.test.js`, `tests/fixtures/figma-export.sample.json`
- Move the spec and plan into the repo (they already sit in `E:\projekty\design-system\docs`).

**Interfaces:**
- **Produces the raw export shape** (returned by `figma-export.js`, saved to `tmp/figma-export.json`, gitignored):
  `{ collections: [{ name, modes: [{ modeId, name }], variables: [{ name, type: "COLOR"|"FLOAT"|"STRING", codeSyntax: string, description: string, valuesByMode: { [modeId]: { r,g,b,a } | number | string | { alias: "<collection>/<variable name>" } } }] }] }`
- **Produces `writeTokens(raw: object, outDir: string): string[]`**, exported from `scripts/sync/write-tokens.mjs`. It returns the written file paths.
  - File per collection mode: `brands/<mode lower-kebab>.json`, `semantic/<light|dark>.json`, `breakpoint/<desktop|mobile>.json`, `component.json`.
  - Each token is `{ "$type": "color"|"dimension"|"fontFamily"|"number", "$value": "#rrggbb" | "#rrggbbaa" | "16px" | "Carlito" | "{palette.primary.600}", "$description"?: string }`.
  - It is nested by `/`-segments of the variable name.
  - A FLOAT becomes `dimension` in px, except for names containing `weight`, `opacity` or `line-height-ratio`, which become `number`.
- **Produces `checkTokens(dir: string): { errors: string[] }`**, exported from `scripts/check-tokens.mjs`. It reports:
  - aliases that don't resolve;
  - a brand file missing a token that another brand has;
  - semantic/breakpoint/component tokens that alias anything outside `palette.*`, `font.*`, `radius.*`, `space.*`, `layout.*` or their own collection.
- npm scripts: `sync:write` (`node scripts/sync/write-tokens.mjs tmp/figma-export.json`), `tokens:check`.

- [ ] **Step 1:** Create the repo.
  - Run `git init`, `npm init`, and set `"type": "module"`.
  - Dev dependencies: `vitest`, `happy-dom`, `style-dictionary@^4`.
  - Commit the existing `docs/` with `chore: spec and plan`.
- [ ] **Step 2: Write the failing tests** in `tests/write-tokens.test.js`, using a hand-made fixture with two Brand modes, one Semantic alias, one FLOAT radius and one font STRING:
  - `writes one file per brand mode`: `brands/dcc.json` and `brands/omelanski.json` exist.
  - `converts colour to hex`: `{r:0.0706,g:0.4118,b:0.6902,a:1}` → `"#1269b0"`, and an alpha of 0.5 gives an 8-digit hex.
  - `writes aliases as DTCG references`: `semantic/light.json` `color.brand.primary.$value === "{palette.primary.600}"`.
  - `writes FLOAT radius as px`: `"16px"`.
  - `keeps placeholder descriptions`.
- [ ] **Step 3:** Run `npx vitest run tests/write-tokens.test.js`. Expected: FAIL (module not found).
- [ ] **Step 4:** Implement `writeTokens`, and `figma-export.js`. The export uses `figma.variables.getLocalVariableCollectionsAsync()` / `getVariableByIdAsync`, resolves alias ids to `<collection>/<name>`, and returns the shape above.
- [ ] **Step 5:** Run the test. Expected: PASS.
- [ ] **Step 6: Write the failing tests** in `tests/check-tokens.test.js`:
  - `flags unresolved alias` → the error names the token path.
  - `flags token missing in one brand` → the error names the brand and path.
  - `passes on a complete set` → `errors.length === 0`.
- [ ] **Step 7:** Implement `checkTokens`, run the tests, and expect PASS.
- [ ] **Step 8: Real sync.**
  - Run `figma-export.js` through `use_figma`, save the result to `tmp/figma-export.json`, then run `npm run sync:write` and `npm run tokens:check`.
  - Expected: 7 token files and 0 errors, with `tokens/semantic/light.json` `color.surface.page` aliasing a `palette.neutral.*` step whose DCC value is `#fbfbfb`.
- [ ] **Step 9: Document "sync tokens" in README.** The sync is: export through use_figma → `npm run sync:write` → `npm run tokens` → commit.
- [ ] **Step 10: Commit** with `feat: token sync from Figma variables`.

---

### Task 3: Token build — CSS and theme.json per brand

**Files:**
- Create: `scripts/build-tokens.mjs`, `dist/**`
- Test: `tests/build-tokens.test.js`

**Interfaces:**
- Consumes: `tokens/**` (Task 2).
- Produces `buildTokens({ tokensDir, outDir }): Promise<void>`, with the npm script `tokens` (= `tokens:check` then build):
  - **`dist/tokens/<brand>.css`:** `:root[data-brand="<brand>"] { --palette-…; --font-family-…; --radius-…; --space-…; --layout-… }`, with literal values.
  - **`dist/tokens/shared.css`:**
    - `:root { <semantic light> <breakpoint desktop> <component> }`, then `:root[data-theme="dark"] { <semantic dark> }`, then `@media (max-width: 781px) { :root { <breakpoint values that differ on mobile, except font sizes> } }`.
    - Every alias is output as `var(--…)`, never resolved.
    - Font-size and line-height tokens that have both a Desktop and a Mobile value become a single `clamp()` in `:root`, using 375 → 1200 px.
  - **`dist/wp/<brand>.theme.json`** (`"version": 3`, settings only):
    - `color.palette` holds one entry per `color.*` semantic Light token. The slug is the kebab path without `color-`, and the colour is resolved hex for that brand.
    - `typography.fontFamilies` lists heading, body and mono (`slug`, `name`, `fontFamily` with fallback stack).
    - `typography.fontSizes` lists every `font-size-*` with `size` = the desktop px and `fluid: { min: "<mobile>px", max: "<desktop>px" }`.
    - `spacing.spacingSizes` comes from `space.*`.
    - `layout.contentSize` = `layout.container`, and `wideSize` = `1440px`.
    - `defaultPalette`, `defaultFontSizes` and `defaultSpacingSizes` are set to `false`, and `custom` is set to `false`.

- [ ] **Step 1: Write the failing tests** in `tests/build-tokens.test.js`, running against the real `tokens/` into a temp dir:
  - `dcc.css sets palette on its brand selector`: it contains `:root[data-brand="dcc"]` and `--palette-primary-600: #1269b0`.
  - `shared.css keeps references`: it contains `--color-brand-primary: var(--palette-primary-600)` and contains no `#1269b0`.
  - `shared.css has dark block`: it contains `:root[data-theme="dark"]` and no `prefers-color-scheme`.
  - `h1 is fluid`: `--font-size-h1` matches `/clamp\(/`, its min equals the value in `tokens/breakpoint/mobile.json` and its max is `56px` (the Desktop value).
  - `theme.json palette resolves per brand`: the `brand-primary` colour is `#1269b0` for dcc and `#2a5db0` for omelanski.
  - `theme.json disables core defaults`.
- [ ] **Step 2:** Run the tests. Expected: FAIL.
- [ ] **Step 3:** Implement with Style Dictionary 4.
  - Use one SD instance per brand: source = `brands/<brand>.json` + all shared files, with brand tokens filtered out of `shared.css`.
  - Register custom formats `ds/css-brand`, `ds/css-shared` and `ds/wp-theme-json`.
  - The `clamp()` calculation: `slope = (max − min) / (1200 − 375)`, `intercept = min − slope·375`, giving `clamp(<min>px, <intercept>px + <slope·100>vw, <max>px)`, rounded to 4 decimals.
- [ ] **Step 4:** Run the tests. Expected: PASS. Then run `npm run tokens` and commit `dist/`.
- [ ] **Step 5: Commit** with `feat: build per-brand CSS and theme.json from tokens`.

---

### Task 4: Storybook skeleton, fonts, Tokens pages and Pages deploy

**Files:**
- Create:
  - `.storybook/{main.js,preview.js,manager.js,decorators.js}`
  - `brands/dcc/fonts/*`, `brands/dcc/fonts.css`, `brands/omelanski/fonts/*`, `brands/omelanski/fonts.css`
  - `stories/foundations/{Colors,Typography,Spacing-Radius,Shadows}.mdx`
  - `components/base/base.css` (reset + body/heading defaults from tokens)
  - `public/placeholders/*.svg`, `.github/workflows/pages.yml`
- Test: `tests/fonts.test.js`, `tests/pages-paths.test.js`

**Interfaces:**
- Consumes: `dist/tokens/*.css` (Task 3).
- Produces:
  - **Toolbar globals:** `brand` (`dcc` | `omelanski`, default `dcc`) and `theme` (`light` | `dark`, default `light`). The decorator `withBrandTheme` sets `document.documentElement.dataset.brand/theme`.
  - **Viewports:** `desktop` 1440×900 and `mobile` 390×844.
  - **Story title convention:** `Atoms/<Name>`, `Molecules/<Name>`, `Organisms/<Name>`, `Sections/<Name>`, `Foundations/<Name>`.
  - Placeholder images are referenced as `./placeholders/<name>.svg`.
  - `preview.js` imports every `components/**/*.css`, the token CSS, both `fonts.css` files, and `swiper/swiper-bundle.css`. It also sets `window.Swiper` from the `swiper/bundle` import.

- [ ] **Step 1:** Scaffold the Storybook: `npm create storybook@latest -- --type html --builder vite --no-dev`.
  - Remove the example stories.
  - Add `@storybook/addon-a11y`, `storybook-addon-pseudo-states`, `@storybook/test-runner`, `swiper@^11` and `concurrently`.
  - If `storybook-addon-pseudo-states` has no release for the installed Storybook major, fall back to rendering forced states with a story-only wrapper attribute (`data-ds-force="hover"`), and add matching selectors only inside `.storybook/forced-states.css`. Generate that file at build time by duplicating the `:hover`/`:focus-visible` rules from `components/**`. Never put forced-state selectors in component CSS.
- [ ] **Step 2: Fonts.**
  - DCC: copy `E:\projekty\dcc-grygorcewicz\assets\fonts\{ubuntu,carlito}-*-{latin-pl,latin-ext}.woff2` and their `@font-face` rules from the DCC theme's fonts CSS (find it with `grep -rl "font-face" assets/css`).
  - Omelanski: copy the woff2 files for `latin` + `latin-ext` of Source Serif 4 (400/500/600), Barlow (400/500/600/700) and JetBrains Mono (400) from `E:\projekty\omelanski\node_modules\@fontsource\*\files\`, with `@font-face` rules taken from the matching fontsource CSS.
  - URLs must be relative (`./fonts/…`).
- [ ] **Step 3: Write the failing tests.**
  - `tests/fonts.test.js`: `every family in a brand fonts.css has a latin-ext face`. Parse the `@font-face` blocks and, for each `font-family`, require one block whose `unicode-range` contains `U+0100-02BA` or the fontsource latin-ext range.
  - `tests/pages-paths.test.js`, `no absolute asset URLs in the static build`: after `npm run build-storybook`, no file in `storybook-static/` that isn't a `.map` contains `url(/` or `src="/`. Skip with a clear message when `storybook-static` is missing.
- [ ] **Step 4:** Implement the decorator, toolbar, viewports and the four Foundations MDX pages.
  - The MDX pages render from the parsed `tokens/` JSON: swatches with names and the resolved value for the current brand/theme read via `getComputedStyle`, the type scale samples with Polish text "Zażółć gęślą jaźń", and the radius/spacing boxes.
  - The docs pages must follow the toolbar too: the decorator also runs for docs.
- [ ] **Step 5:** Run `npm test`, `npm run build-storybook` and `npx vitest run tests/pages-paths.test.js`. Expected: all PASS.
- [ ] **Step 6:** Write `.github/workflows/pages.yml`. On push to `main`:
  - setup-node 22, `npm ci`, `npm test`, `npm run build-storybook`;
  - `npx concurrently -k -s first "npx http-server storybook-static -p 6006 -s" "npx wait-on tcp:6006 && npx test-storybook --url http://127.0.0.1:6006"`;
  - `actions/upload-pages-artifact` with `storybook-static`, then `actions/deploy-pages`.
  - Permissions: `pages: write`, `id-token: write`.
  - Make the a11y addon fail the test-runner on violations: `parameters.a11y.test = "error"`.
- [ ] **Step 7: Create the GitHub repo and push.**
  - Run `gh repo create LukaszMoszczynski/design-system --public --source . --push`, then `gh api -X POST repos/LukaszMoszczynski/design-system/pages -f build_type=workflow`.
  - Expected: the workflow is green, and `https://lukaszmoszczynski.github.io/design-system/` shows Foundations. Switching Brand to Omelanski turns the swatches cream/navy and the type serif.
- [ ] **Step 8: Commit** with `feat: Storybook with brand/theme toolbar, fonts, tokens pages, Pages deploy`.

---

### Task 5: Component conventions and the guard tests

**Files:**
- Create:
  - `scripts/check-css-values.mjs`
  - `tests/helpers/load-script.js`
  - `components/README.md` (how to copy a component into a WordPress theme)
  - `components/_template/` (example folder)
- Test: `tests/check-css-values.test.js`, `tests/token-usage.test.js`

**Interfaces:**
- Produces:
  - `checkCssValues(globPattern: string): { file: string, line: number, value: string }[]`. It is wired into `npm test` over `components/**/*.css`, and the allowed values are exactly those in Global Constraints.
  - `loadScript(path: string, window: Window): void`, which evaluates a classic script inside a happy-dom window for JS tests.
  - **Story contract:** each `*.stories.js` exports a `render(args) => string` template, `argTypes` for every Figma property, and one story per Figma variant/state. States use `parameters.pseudo` (or the Task 4 fallback).
  - **README contract:** for each component, give the markup with every class and attribute, the CSS files to copy, the JS file and its init, and the WordPress note (where `render.php` puts dynamic values).

- [ ] **Step 1: Write the failing tests.**
  - `check-css-values.test.js`, using fixture CSS:
    - `#fff` is flagged;
    - `12px` is flagged;
    - `1px solid var(--color-border-default)` passes;
    - `color-mix(in srgb, var(--color-brand-primary) 20%, transparent)` passes.
  - `token-usage.test.js`, `every var() used in components exists for every brand`: collect `var(--name` from `components/**/*.css`, and for each brand require `name` to be defined in `dist/tokens/shared.css` or `dist/tokens/<brand>.css`.
- [ ] **Step 2:** Run the tests. Expected: FAIL.
- [ ] **Step 3:** Implement `checkCssValues` and `loadScript`, and write `components/README.md`.
- [ ] **Step 4:** Run the tests. Expected: PASS, since there are no components yet.
- [ ] **Step 5: Commit** with `feat: component guards and conventions`.

---

### Tasks 6–9: Components by level

Every component below follows the same cycle:

1. **Read.** Run `get_design_context` on its Figma node (load `/figma-design-to-code` first) and read its legend. Read the DCC source listed, for behaviour only.
2. **Test JS first, if the component has JS.** In `tests/components/<name>.test.js`, write a failing behaviour test, plus `init twice attaches one handler` (call `init` twice, trigger once, assert one state change).
3. **Build.** Write the CSS, JS, stories and README.
4. **Check.** Run `npm test`.
5. **Compare.** Open the story in Storybook (Chrome DevTools MCP) at desktop and mobile, compare it with `get_screenshot` of the Figma variant, and fix differences larger than 2 px or any colour mismatch.
6. **Switch.** Change to Omelanski and to Dark, and confirm nothing stays DCC-coloured and nothing overflows. Polish strings go in the default args.
7. **Commit,** one per component group: `feat(atoms): button family` etc.

Behaviour tests are given only where a component has JS. Pure-CSS components are covered by the guard tests, the a11y run and the visual comparison.

### Task 6: Atoms (Figma page `2:17`)

| Component folder | Figma section | DCC behaviour source | JS test |
|---|---|---|---|
| `atoms/icon` | Icons (`3:138`) | `inc/helpers.php` `dcc_arrow_svg()` | — |
| `atoms/button` (+ outline, arrow) | Button, Button/Outline · Button/Arrow | `assets/css/base.css` `.dcc-btn*` | — |
| `atoms/link`, `atoms/label`, `atoms/text` | Link · Label, Text | `base.css` | — |
| `atoms/breadcrumbs` | Breadcrumbs | `base.css` | — |
| `atoms/carousel-controls` | Carousel controls | `assets/js/carousel.js` | — (wired in Task 8) |
| `atoms/nav-link`, `atoms/tag`, `atoms/number` | Navigation · Tags · Numbers | `blocks/naglowek/style.css`, `blocks/model` | — |
| `atoms/social-button` | Social | `components/social.css` | — |
| `atoms/form-field` | Form fields | `blocks/kontakt/style.css` | — |
| `atoms/badge-pill` | Badge pill | `components/odznaka.css` | — |

- [ ] **Step 1:** Icons are inline SVG with `stroke="currentColor"`, and `ds-icon--{arrow-diagonal,chevron-left,chevron-right,plus,minus}`.
- [ ] **Step 2:** Do Buttons, with all Figma variants and states as stories. Pressed and disabled are proposals; build them, and mark them "proposal" in the story description.
- [ ] **Step 3:** Do the remaining atoms per the table, committing after each row.

### Task 7: Molecules (Figma page `2:18`)

| Folder | Figma | DCC source | JS behaviour test |
|---|---|---|---|
| `molecules/heading-group` | Heading group `10:162` | `base.css` | — |
| `molecules/accordion` (item + list) | `10:54`, `10:121` | `blocks/faq` | Uses native `<details>`, which works without JS. JS only enforces one-open-per-list when `data-ds-single`. Tests: `opening one closes the other with data-ds-single`, `init twice attaches one handler`. |
| `molecules/accordion-challenge` | `25:211` | `blocks/lista-wyzwan` | — (details) |
| `molecules/pagination` (dots, counter, pages) | `10:150`, `25:295` | `assets/js/carousel.js` | — (driven by the carousel) |
| `molecules/check-item` | `22:178` | `blocks/programy` | — |
| `molecules/badge-circular` | `51:51` | `blocks/wezwanie` (SVG textPath) | — |
| `molecules/social-row` | `76:177` | `components/social.css` | — |
| `molecules/model-step`, `molecules/model-word` | `25:304`, `25:305` | `blocks/model` | — |
| `molecules/card-program`, `card-tile`, `card-person`, `card-partner`, `card-hero-tile`, `card-industry-step`, `card-post`, `card-recommendation`, `card-testimonial`, `card-product`, `card-training`, `card-contact` | the respective Card/* nodes on page `2:18` | `blocks/karty`, `programy`, `osoby`, `logotypy`, `hero`, `components/post-card.css`, `blocks/opinie`, `blocks/sklep`, `blocks/kontakt` | — |

- [ ] **Step 1:** Heading group, Check item, Pagination, Social row and Badge/Circular, one commit.
- [ ] **Step 2:** Accordion: tests first (per the table), then the build, one commit.
- [ ] **Step 3:** Accordion/Challenge, Model step/word, one commit.
- [ ] **Step 4:** The cards, one commit per 3–4 cards. Every card's whole surface is one link where Figma/DCC does it (Card/Product, Card/Post, Card/Hero tile), with a single focus ring.

### Task 8: Organisms (Figma page `2:19`)

| Folder | Figma | DCC source | JS behaviour tests |
|---|---|---|---|
| `organisms/carousel` | `12:807` | `inc/carousel.php`, `assets/js/carousel.js` | Each test is listed separately below. |
| `organisms/call-to-action` | `28:968` (5 variants) | `blocks/wezwanie` | — |
| `organisms/header` + `organisms/mega-menu` | `28:1049`, `59:51` | `blocks/naglowek` | Each test is listed separately below. |
| `organisms/mobile-menu` | `102:296` | `blocks/naglowek` | Each test is listed separately below. |
| `organisms/footer` | `28:1208` | `blocks/stopka` | — |
| `organisms/buy-box` | `102:239` | `blocks/produkt` | Each test is listed separately below. |

The JS behaviour tests, one bullet per test:

- **Carousel:**
  - `creates one Swiper per carousel`, with `window.Swiper` stubbed.
  - `slidesPerView from data-ds-items on desktop, 1 on mobile`.
  - `init twice creates one Swiper`.
  - `prev/next buttons get aria-labels and aria-controls`.
- **Header + Mega menu:**
  - `adds is-scrolled after scrollY > 0`.
  - `toggle opens the mega menu and sets aria-expanded`.
  - `Escape closes and returns focus`.
  - `init twice`.
- **Mobile menu:**
  - `Escape closes the drawer only` (DCC review found Escape closing both).
  - `opening locks body scroll without a scrollbar jump`.
  - `init twice`.
- **Buy box:**
  - `brutto/netto toggle switches the shown price`.
  - `stepper total = unit × quantity, min 1`.
  - `init twice`.

Carousel API for sections:
- Markup: `<div class="ds-carousel" data-ds-items="2|3|4" data-ds-nav="below|beside-heading|above-right">`, with the slides as `.ds-carousel__slide` children holding any card.
- Pagination type: `data-ds-pagination="dots|counter"`.
- Settings: `loop` only when there are more slides than `data-ds-items`. Whole cards only on desktop, a peek allowed on mobile.

- [ ] **Step 1:** Carousel: tests first, then the build, then the stories for 2/3/4 items × 3 nav placements + mobile with Card/Tile and Card/Post slides. Commit.
- [ ] **Step 2:** Call to action, all 5 variants. Commit.
- [ ] **Step 3:** Header + Mega menu + Mobile menu: tests first, then the build. Commit.
- [ ] **Step 4:** Footer. Commit.
- [ ] **Step 5:** Buy box: tests first, then the build. Commit.

### Task 9: Example sections (Figma page `86:2270`)

| Folder | Figma | DCC source | Composes |
|---|---|---|---|
| `sections/hero` | `81:314` (Large, Contact, Subpage light/violet/orange; Mobile) | `blocks/hero` | heading group, button, card-hero-tile |
| `sections/text-image` | `91:219` (Image right/left, Panorama, Centered, Photos) | `blocks/tekst-obraz` | heading group, button, link, badge-circular |
| `sections/faq` | `130:918` | `blocks/faq` | heading group, accordion (two-column / one-column) |
| `sections/testimonials` | `95:227` | `blocks/opinie` | heading group, carousel, card-testimonial |

- [ ] **Step 1:** Each section's story builds its markup **only** by calling the `render()` functions of the components it composes (import them from their stories files). The section CSS covers only the layout. The `check-css-values` guard applies.
- [ ] **Step 2:** Compare each variant against Figma in both brands and both themes, at desktop and mobile. Commit one per section.
- [ ] **Step 3:** Add a `Sections/Overview` story: one page with all four sections stacked, the best place to judge the brand switch.

---

### Task 10: Copy guide and final check

**Files:** Modify `README.md`, `components/README.md`.

- [ ] **Step 1: README "Use in a WordPress site".**
  - Copy `dist/tokens/shared.css` + `dist/tokens/<brand>.css` + `brands/<brand>/fonts*`.
  - Add `data-brand="<brand>"` to `<html>` via the `language_attributes` filter.
  - Merge `dist/wp/<brand>.theme.json` settings into the theme's `theme.json`.
  - Copy the needed `components/*/` folders, enqueueing CSS in the order tokens → base → atoms → molecules → organisms → sections.
  - Paste each README's markup into `render.php`.
  - Enqueue Swiper before `carousel.js`.
- [ ] **Step 2: README "Add a brand".** Follow the Figma steps from Task 1 Step 6, then sync → `npm run tokens` → add `brands/<brand>/fonts.css` → add the brand to the toolbar list in `.storybook/preview.js`.
- [ ] **Step 3: Full check.**
  - Run `npm test`, `npm run build-storybook` and the test-runner locally. Expected: all green, 0 a11y violations.
  - Push and wait for the Pages workflow to go green.
  - Open the live URL and run through all stories with Brand = Omelanski + Dark.
- [ ] **Step 4: Commit and push** with `docs: copy guide and add-a-brand guide`.
