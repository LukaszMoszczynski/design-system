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
- `argTypes` for every Figma property. Fixed forced states (storybook-addon-pseudo-states) are set as
  story **globals**, `globals: { pseudo: { hover: ['.ds-button'] } }`, not `parameters.pseudo`: the addon copies
  `parameters.pseudo` into its sticky `pseudo` global, so the next story (and every test-runner story after it, the runner
  reuses the page) rendered with the previous story's hover/focus, and a forced story's first render (the one axe checks)
  had the stale state. Story globals apply on the first render and end with the story. Target the component with a
  selector array; `true` forces the state on every element, the label and icon spans included.
- Default state is the one at rest (closed, not hovered). Polish strings go in the default `args`.

Stories per component (owner, from Task 7 on; atoms, molecules and organisms follow it):

- `Playground`: every arg is a control, plus a `state` control (`default` / `hover` / `focus`, `STATE_ARG_TYPES` from
  `.storybook/state.js`) and a `disabled` boolean where it applies. `parameters.stateTargets` (selector array) names the
  elements that take the state. The global `withForcedState` decorator puts the addon's `pseudo-hover` /
  `pseudo-focus-visible` class on them, the same classes `globals.pseudo` sets, but on the story's own DOM, so nothing
  sticks to the next story.
- `Overview`: one grid with every variant, and the states side by side where they matter (`overviewGrid`, `overviewCell`,
  `forceState(markup, state, selectors)` from `.storybook/state.js`). Spread `OVERVIEW_STATE` into it: it hides the
  `state` control there and the decorator leaves the grid alone.
- `stateControlPlay({ selector, property })` (Card Program Playground) proves in the test runner that the `state` control
  changes a computed style, so an addon upgrade cannot silently turn every forced state into a no-op.
- At most one or two extra example stories, only where the content differs in a way that matters (a card with or without
  an image, a behaviour to try). No Pressed state.

## Arg names (templates and stories)

One vocabulary for every `render<PascalName>(args)`, so a molecule passes the same names to every atom:

| Arg | Meaning | Examples |
| --- | --- | --- |
| `text` | the visible text | `renderButton({ text })`, `renderLink`, `renderTag`, `renderNavLink`, breadcrumb `items: [{ text, href }]`, select `options: [{ value, text }]` |
| `ariaLabel` | the accessible name of an icon-only control or a landmark (never shown) | `renderButtonArrow`, `renderCarouselArrow`, `renderSocialButton`, `renderNavBurger`, `renderBreadcrumbs` (the nav) |
| `variant` | the look: Figma Style, Kind, Type, Variant, Context, Layout, Arrow or a surface Tone | `primary`, `inverted`, `raised`, `step`; molecules: heading group `split`, pagination `pages`, accordion `two-columns`, card contact `social`, card post `primary`, card recommendation `blue`, card partner `carousel` |
| `size` | the size, where an atom has sizes | (none of the atoms yet) |
| `href` | the link target; given, the atom renders `<a href>` | `renderButton`, `renderTag`, `renderButtonOutline` |
| `overline` | the small text above a title or a value | `renderHeadingGroup`, `renderCardContact`, `renderCardTraining` |
| `headingTag` | the heading level of a molecule title (`CARD_HEADING_TAGS` in `components/_shared/heading-tags.js`; the look stays) | every card, `renderHeadingGroup` |

Other axes keep their own names when they are independent of the look: `shape` (button arrow/pill), `tone` (text colour),
`tag` (the root HTML element; a heading level is always `headingTag`), `name` (which icon or which form field), `network`, `direction`, and the states `disabled`,
`current`, `active`, `open`, `checked`. `label` is used only by form controls, for the text of their visible
`<label>` element (`renderFormField`, `renderCheckbox`); it never means an aria-label. Secondary accessible names are
`<thing>AriaLabel` (`submitAriaLabel`). A bold lead-in term is `term` (`renderModelStep`, `challengeTerm` /
`actionTerm` in Card/Industry step), the hashtag of Card/Hero tile is `hashtag`, a pill title above benefits is
`benefitsTitle`. `tone` stays a text colour (Text atom, Check item list).

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

### Motion (GSAP)

GSAP is the animation tool (owner). **Enqueue `gsap` (+ `ScrollTrigger`) before the component scripts; components degrade
without it.** Storybook loads both as `window.gsap` / `window.ScrollTrigger` in `.storybook/preview.js`, the way a site
enqueues them.

- GSAP: real motion, such as an accordion's height, the model's hover wave, reveals and counters. Match the easing and
  duration of the DCC site (`assets/js/app.js`).
- CSS transitions: simple colour, border, shadow (and single-element hover transform) changes.
- A script reads `window.gsap` when it animates. Without it, or with `prefers-reduced-motion: reduce`, it falls back to the
  instant or native behaviour (a `<details>` still opens). It stays idempotent.
- Tests: every animated component has `works without gsap` and `uses gsap when present` (a stubbed `window.gsap`), see
  `tests/components/accordion.test.js`.
- Scroll reveal: `components/base/reveal.js` (`window.DS.reveal`) lifts every `[data-ds-reveal]` below the fold in when it
  scrolls into view (the site's `data-reveal`: 60 px, 1 s, `power4.out`, 0.1 s stagger per row). It needs `gsap` and
  `ScrollTrigger`; content already on screen is left as it is. The Call to action content carries the attribute.

## Organism contracts used by sections

- **Carousel** (`organisms/carousel`, full table in its README): the script wires `.ds-carousel[data-ds-carousel]` only.
  `data-ds-items` (2–4) sets the cards per view and the loop rule (loop from 2 × the most cards in view, else rewind),
  `data-ds-nav` places the nav in CSS and must match where `div.ds-carousel__nav` sits in the markup,
  `data-ds-pagination` (dots / counter) picks the control the script keeps in step. Slides are
  `.ds-carousel__viewport > .ds-carousel__track > .ds-carousel__slide`, any card inside. Use `renderCarousel()` to get
  all of it right.
- **Header**: the Mega menu panel sits inside the Oferta `li`, right after its toggle (focus order); the Mobile menu
  after the bar. Load `header.js` and `mobile-menu.js` (and `accordion.js` for the drawer's Oferta row).

## Sections

`sections/<name>` (Hero, Text + image, FAQ, Testimonials) build their markup only by calling the `render*` functions of
the parts they compose (from the `*.template.js` files, never from stories); their own CSS places those parts (and paints
a section surface such as the hero box). `Sections/Overview` stacks all four on one page to judge the brand and theme
switch. The carousel's `centered` option (`data-ds-centered`) is the testimonials' centre card.

## Documenting a component

For each component give: the markup with every class and attribute, the CSS files to copy, the JS file and its `init`
call, and the WordPress note (which dynamic values `render.php` prints where).

## Copying a component into a WordPress theme

1. Copy the token CSS once: `dist/tokens/shared.css` and `dist/tokens/<brand>.site.css` (the brand on a plain `:root`, so
   it also reaches the block editor iframe), plus `components/base/base.css`. Add `data-theme="dark"` on `<html>` for a dark site.
2. Copy `<name>.css` (and the CSS of any component it contains) and enqueue it after the tokens.
3. Paste the markup from the template into the block's `render.php`. Replace the interpolated args with PHP echoes
   escaped with `esc_html()` / `esc_attr()` / `esc_url()`; the structure, classes and `data-` attributes stay as they are.
4. If the component has JS, copy `<name>.js`, enqueue it in the footer. It auto-inits; call `window.DS.<name>.init(container)`
   after injecting markup (for example after a Swup page change).

## Example: `_template`

Markup (`renderExample`): `<button type="button" class="ds-example" data-ds-example aria-pressed="false">Przełącznik</button>`.
CSS: `_template/_template.css`. JS: `_template/_template.js`, `window.DS.example.init()`.
WordPress: `<?php echo esc_html( $attributes['text'] ); ?>` in place of the text; `aria-pressed` is `"true"` or `"false"`.

## Quick copy checklist

The full site guide is the root `README.md` ("Use in a WordPress site"). Short form: tokens CSS and `base.css` first, then
component CSS ordered atoms → molecules → organisms → sections; GSAP + ScrollTrigger, then Swiper, then the component
scripts (classic, auto-init, `window.DS.<name>.init(root)`: `reveal`, `accordion`, `carousel`, `header`, `mobileMenu`,
`buyBox`); `<brand>.site.css` for the brand (no attribute needed), optional `data-theme="dark"` on `<html>`. Every component folder has a `README.md` listing its CSS parts, markup hooks and WordPress notes.
