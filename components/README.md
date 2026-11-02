# Components

Every component is a folder `components/<level>/<name>/` (levels: `atoms`, `molecules`, `organisms`, `sections`;
`base/` holds the page defaults). A component is brand-switchable and copyable into a WordPress theme because it
follows the rules below. `_template/` is a working example of all of them (not shown in Storybook).

## Files

| File | Purpose |
| --- | --- |
| `<name>.css` | Styles. Tokens only (see Guards). Classes are prefixed `ds-`. |
| `<name>.template.js` | `export function render<PascalName>(args)` returns the HTML string. Text args go through `escapeHtml` from `components/_shared/escape.js`. Stories and sections import it. |
| `<name>.js` | Optional behaviour, only if the component needs JS. |
| `<name>.stories.js` | Storybook stories. |
| `README` section | One entry per component in this file or beside it (see Documenting a component). |

## Story contract

- The stories file imports `render<PascalName>` from the template. It never exports `render`: CSF would take it for a story.
- `argTypes` for every Figma property, one story per Figma variant/state. States use `parameters.pseudo` (for example `{ hover: true }`).
- Default state is the one at rest (closed, not hovered). Polish strings go in the default `args`.

## Guards (run by `npm test`)

- `scripts/check-css-values.mjs` over `components/**/*.css`. Allowed values: `var(--…)`, `color-mix()`, `0`,
  `1px`/`2px` hairlines, `%`, `fr`, unitless numbers, `currentColor`, `transparent`, `inherit`, `calc()` of allowed
  operands, and plain keywords (`none`, `auto`, `solid`, …). Flagged: hex/rgb/hsl colours, named colours, px/rem/em/vw/vh literals.
  Media query breakpoints are not checked (they cannot use `var()`).
- `tests/token-usage.test.js`: every `var(--name)` used in components exists in `dist/tokens/shared.css` or in each
  brand file (`dcc`, `omelanski`). A custom property a component defines itself is exempt.
- `tests/story-contract.test.js`: no stories file exports `render`.
- Selector rules, also in `check-css-values`: every class starts with `ds-` (`is-*`/`has-*` state classes are fine on a
  compound that has a `ds-` class) and no selector mentions `data-brand` (brands switch through tokens only).
- Each guard asserts it scanned real files, so a broken glob fails instead of passing empty.
- Hairlines may be signed (`-1px`, `-2px`).

## JS convention

Classic script: no `import`/`export`, wrapped in an IIFE. It registers `window.DS.<camelName> = { init(root = document) }`,
runs `init()` on `DOMContentLoaded` (or at once if the DOM is ready) and is idempotent: it marks handled elements with
`data-ds-ready` and skips them, so a second `init()` (Swup navigation, block editor preview, Storybook) attaches nothing twice.

Storybook: the script auto-inits at import, before any story DOM exists, so the global decorator `withComponentScripts`
(`.storybook/decorators.js`) renders each story into a wrapper and calls `init(wrapper)` of every registered `window.DS.<name>`.
A stories file only has to `import './<name>.js'` (see `_template.stories.js`); nothing else per story. `init(root)` searches
inside `root`, so pass a container, not the component element itself.

Test it with `tests/components/_template.test.js` as the pattern: `loadScript(path, window)` from
`tests/helpers/load-script.js` evaluates the script in a happy-dom window; the test calls `init` twice, triggers once and
asserts one state change.

## Documenting a component

For each component give: the markup with every class and attribute, the CSS files to copy, the JS file and its `init`
call, and the WordPress note (which dynamic values `render.php` prints where).

## Copying a component into a WordPress theme

1. Copy the token CSS once: `dist/tokens/shared.css` and `dist/tokens/<brand>.css`, plus `components/base/base.css`.
   Set `<html data-brand="…" data-theme="…">`.
2. Copy `<name>.css` (and the CSS of any component it contains) and enqueue it after the tokens.
3. Paste the markup from the template into the block's `render.php`. Replace the interpolated args with PHP echoes
   escaped with `esc_html()` / `esc_attr()` / `esc_url()`; the structure, classes and `data-` attributes stay as they are.
4. If the component has JS, copy `<name>.js`, enqueue it in the footer. It auto-inits; call `window.DS.<name>.init(container)`
   after injecting markup (for example after a Swup page change).

## Example: `_template`

Markup (`renderExample`): `<button type="button" class="ds-example" data-ds-example aria-pressed="false">Przełącznik</button>`.
CSS: `_template/_template.css`. JS: `_template/_template.js`, `window.DS.example.init()`.
WordPress: `<?php echo esc_html( $attributes['label'] ); ?>` in place of the label; `aria-pressed` is `"true"` or `"false"`.
