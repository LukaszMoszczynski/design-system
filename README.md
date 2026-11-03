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
   Every run also returns `effectStyles` (the Shadow/* effect styles); keep them in the merged file.
2. `npm run sync:write` writes `tokens/**` (one DTCG file per collection mode, plus `tokens/effects.json`
   with the shadows, built into `shared.css` as `--shadow-<name>`).
3. `npm run tokens:check` verifies aliases resolve, every brand has the same tokens, and aliases
   only point at brand groups or their own collection.
4. `npm run tokens` builds the CSS from the tokens.
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
- Every component has a Docs page (autodocs): its description and, under each story, "Show code" with the template's
  HTML as a site pastes it (no Storybook wrapper, no `data-ds-ready`, no forced-state classes; `.storybook/source.js`).
- Placeholder images: `public/placeholders/*.svg`, referenced as `./placeholders/<name>.svg`.

## Use in a WordPress site

Nothing here is installed as a package: a site copies files. Replace `<brand>` with `dcc` or `omelanski`.

### 1. Tokens, fonts and the brand

1. Copy `dist/tokens/shared.css`, `dist/tokens/<brand>.site.css` and `brands/<brand>/fonts.css` with its `brands/<brand>/fonts/` folder
   (keep them side by side: `fonts.css` loads `./fonts/*.woff2`).
2. `<brand>.site.css` sets the brand values on a plain `:root`, so a one-brand site needs no attribute: the brand applies on
   the front end and inside the block editor iframe alike (the editor iframe's `<html>` never gets `data-brand`).
   `dist/tokens/<brand>.css` is the same values scoped to `:root[data-brand="<brand>"]`; Storybook uses it to switch
   brands, and only a site that switches brands on one install needs it (then `data-brand` has to reach the editor too).
3. Dark mode is opt-in with `data-theme="dark"` on `<html>` (the `language_attributes` filter, front end only); leave it out
   for light. The theme also sets `color-scheme`, so native controls (select lists, scrollbars) follow it.

   ```php
   add_filter( 'language_attributes', function ( $output ) {
       return $output . ' data-theme="dark"'; // only for a dark site
   } );
   ```
4. Merge the `settings` of `dist/wp/<brand>.theme.json` into the theme's `theme.json` (palette, font families, font sizes,
   spacing, layout). It turns the WordPress core palette, font sizes and spacing sizes off (`defaultPalette`,
   `defaultFontSizes`, `defaultSpacingSizes` = false, custom values off), so the editor offers brand values only. The palette is the static Light hex values, so the block editor does not follow
   `data-theme="dark"`.
   Fluid type runs between 375 px and 1200 px viewport (`typography.fluid`).

### 2. Component CSS, in this order

Enqueue the CSS on the `enqueue_block_assets` hook: it loads on the front end and inside the block editor iframe, so the
editor preview is branded too (`wp_enqueue_scripts` alone reaches only the front end). Order: **tokens → base → atoms →
molecules → organisms → sections**:

1. `shared.css`, `<brand>.site.css`, `fonts.css`
2. `components/base/base.css` (reset and page defaults)
3. the `components/atoms/<name>/<name>.css` you use
4. `components/molecules/<name>/…`, then `components/organisms/<name>/…`, then `components/sections/<name>/…`

Copy a component together with the CSS of every part it contains: each component's README lists them under "CSS".
Copy only what the site uses.

### 3. Markup

Paste the markup from each component's README (`components/<level>/<name>/README.md`; every component folder has its own `README.md`; `components/README.md` holds the shared rules, and `<name>.template.js` is the exact source; "Show code" under each story on the component's Docs page in Storybook gives that exact HTML, inline SVGs included) into the block's `render.php`. Replace the
interpolated values with `esc_html()` / `esc_attr()` / `esc_url()` echoes. Classes (`ds-*`) and `data-ds-*` attributes stay
exactly as they are: the CSS and scripts read them (for example the carousel contract in
`components/organisms/carousel/README.md`).

### 4. JavaScript

Classic scripts, no modules. Enqueue them in the footer in this order:

1. **GSAP and ScrollTrigger** (the owner's animation tool): `window.gsap`, `window.ScrollTrigger`.
2. **Swiper 11** (`swiper-bundle.min.js` and its CSS), as `window.Swiper`. Needed by `carousel.js`.
3. The component scripts: `components/base/reveal.js`, `molecules/accordion/accordion.js`,
   `organisms/carousel/carousel.js`, `organisms/header/header.js`, `organisms/mobile-menu/mobile-menu.js`,
   `organisms/buy-box/buy-box.js` (only those the site uses). Header and mobile menu go with `accordion.js`.

Every script auto-inits on `DOMContentLoaded` and exposes `window.DS.<name>.init(root)`:
`reveal`, `accordion`, `carousel`, `header`, `mobileMenu`, `buyBox`. After adding markup later (a Swup page change, an AJAX
fragment), call `window.DS.<name>.init(container)` for the components in it; handled elements carry `data-ds-ready`, so a
second call attaches nothing twice. There is no `destroy`: if Swup removes a carousel, Swiper's instance is left to the
garbage collector with the DOM node.

Without GSAP the components still work (instant instead of animated), and they skip motion under
`prefers-reduced-motion: reduce`. Scroll reveal needs GSAP and ScrollTrigger.

### Example (one site, DCC)

```php
// CSS: front end and block editor iframe.
add_action( 'enqueue_block_assets', function () {
    wp_enqueue_style( 'ds-tokens', get_theme_file_uri( 'ds/tokens/shared.css' ), array(), null );
    wp_enqueue_style( 'ds-brand', get_theme_file_uri( 'ds/tokens/dcc.site.css' ), array( 'ds-tokens' ), null );
    wp_enqueue_style( 'ds-fonts', get_theme_file_uri( 'ds/brands/dcc/fonts.css' ), array( 'ds-brand' ), null );
    wp_enqueue_style( 'ds-base', get_theme_file_uri( 'ds/components/base/base.css' ), array( 'ds-brand' ), null );
    wp_enqueue_style( 'ds-swiper', get_theme_file_uri( 'js/swiper-bundle.min.css' ), array(), null ); // for the carousel
    // atoms, molecules, organisms, sections: each depends on the one before, e.g.
    wp_enqueue_style( 'ds-icon', get_theme_file_uri( 'ds/components/atoms/icon/icon.css' ), array( 'ds-base' ), null );
} );

// JS: front end only, in the footer.
add_action( 'wp_enqueue_scripts', function () {
    wp_enqueue_script( 'gsap', get_theme_file_uri( 'js/gsap.min.js' ), array(), null, true );
    wp_enqueue_script( 'scrolltrigger', get_theme_file_uri( 'js/ScrollTrigger.min.js' ), array( 'gsap' ), null, true );
    wp_enqueue_script( 'swiper', get_theme_file_uri( 'js/swiper-bundle.min.js' ), array(), null, true );
    wp_enqueue_script( 'ds-carousel', get_theme_file_uri( 'ds/components/organisms/carousel/carousel.js' ), array( 'scrolltrigger', 'swiper' ), null, true );
} );
```

A classic theme can use `add_editor_style()` instead for the editor; `enqueue_block_assets` covers both in one place.

### Contrast (DCC palette)

Some DCC colour pairs (the accent-coloured buttons and tags, for instance) are below WCAG AA. The stories that show them
switch off only axe's `color-contrast` rule (`CONTRAST_OFF` from `.storybook/a11y.js`); every other a11y rule still fails
CI there (the test runner runs every story with `a11y.test: 'error'`). Changing the palette is the owner's decision, not
the components'.

## Add a brand

A brand is a mode in the Figma collection **Brand**, not a new file. Omelanski is a placeholder brand that proves the switch.

1. In Figma (file `JfRuc3T6MhLuse40bo2g9W`), collection **Brand**, add a mode named after the brand.
2. Fill every variable (palette, fonts, radius, layout). Semantic, Breakpoint and Component collections never change per brand.
3. Set Brand = the new mode on a page frame to preview it.
4. Sync the tokens (see "Sync tokens"; it runs through Claude with the Figma MCP, because Figma Enterprise variable
   export is not available): `use_figma` export, `npm run sync:write`, which creates `tokens/brands/<brand>.json`.
5. `npm run tokens` checks the tokens and builds `dist/tokens/<brand>.css`, `dist/tokens/<brand>.site.css` and `dist/wp/<brand>.theme.json`.
6. Add `brands/<brand>/fonts.css` and `brands/<brand>/fonts/` (self-hosted woff2), and optionally
   `brands/<brand>/brand.json` `{ "title": "Acme" }` for the toolbar name (default: the capitalised folder name).

That is all: add files only. The Storybook toolbar, the token and font imports, and the tests derive the brand list from
`dist/tokens/<brand>.css`, `brands/<brand>/fonts.css` and `tokens/brands/<brand>.json`, so no shared file is edited.
Run `npm test` and `npm run build-storybook` to check.
