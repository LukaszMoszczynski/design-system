# Multi-brand design system + Storybook — design

Date: 2026-11-02
Status: draft, waiting for approval

## Why

The DCC site (`E:\projekty\dcc-grygorcewicz`, WordPress block theme) was the first site. The owner wants to build similar sites for other clients fast, and automate as much as possible. The design lives in the Figma file **Atomic Design** (`JfRuc3T6MhLuse40bo2g9W`), which was built from the DCC code. This project turns that file into a **design system repo**: tokens that can be switched per brand, plain HTML/CSS/JS components, and a public Storybook where you can flip between brands.

This is project 1 of a larger chain (the order was agreed with the owner):

1. **This design system repo**, together with the multi-brand update of the Figma file (this document).
2. Later, separately: move the DCC site onto the English token names and the shared components.
3. Later, separately: a WordPress starter theme that gets the components **copied in** (not installed as a package), plus new-site automation.

## Goals

- **One Figma file, many brands.** A brand is a mode, not a duplicated file. DCC is brand 1. Omelanski is brand 2, **a placeholder only**: it exists to prove that switching works.
- **Figma first, code follows.** Tokens are changed in Figma, then pulled into the repo as JSON and built into CSS. Code never becomes the source of a token value.
- **English token names everywhere**, the ones the Figma file already uses (`color/brand/primary` → `--color-brand-primary`).
- **Components as plain HTML + CSS + small vanilla JS.** No React or other framework. A WordPress site takes them by copying the CSS/JS files and pasting the markup into its PHP templates.
- **A public Storybook on GitHub Pages**, rebuilt on every push, with a toolbar switch for **Brand × Light/Dark**. Its viewport presets match the Figma Desktop (1440) and Mobile (390) frames.
- **Per-brand build output:** a CSS custom-properties file for each brand, and a WordPress `theme.json` preset fragment for each brand (palette, font families, font sizes, spacing, layout), so the future starter theme can drop them in.

## Non-goals

- No WordPress theme, PHP or ACF blocks in this repo.
- No npm package to install. Sites copy files instead, so the owner doesn't maintain a published library.
- No changes to the DCC site in this project. That is project 2.
- Omelanski is not a real client brand here. Its values only need to be plausible, not exact.
- The phone navigation drawer stays not built, as it isn't in the Figma file either (the Mobile menu organism is the only phone menu).

## Anti-goals (failure even if it "works")

- Components hard-code a colour, size or font instead of using a token. Switching the brand in Storybook would then leave parts in DCC colours.
- Token names drift from Figma names, so the two can't be compared one-to-one.
- Markup that only works inside Storybook: anything that needs Storybook's runtime, or a JS framework, to render.
- A setup so complex that copying one component into a new WordPress theme means more than copying its folder and the token CSS.

## What exists now (facts from recon)

**Figma file `JfRuc3T6MhLuse40bo2g9W`.** Pages:

- Cover, Tokens, Atoms, Molecules, Organisms, Sections, Examples.
- **Variable collections:**
  - Primitives (raw palette `color/blue|violet|orange|gray/*`, white, black, radii `none…4xl, full`, spacing scale, font families)
  - Semantic (modes Light / Dark: `color/brand/*`, `color/surface/*`, `color/text/*`…)
  - Breakpoint (modes Desktop / Mobile: type sizes, gutters, container widths)
  - Component (aliases such as `button/radius`, `card/radius`, `carousel/dot-size`)
- Every token has its CSS custom-property name set as Figma code syntax.
- Effect styles: Shadow/Card and Shadow/Lift.
- The Tokens page holds a "How to use this library for a new brand" guide, which today says to duplicate the file.
- **Atoms:** Icons (arrow diagonal, chevron, plus/minus), Button, Button/Outline, Button/Arrow, Link, Label, Text, Breadcrumbs, Carousel controls, Navigation, Tags, Numbers, Social, Form fields, Badge pill.
- **Molecules:** Card/Program, Card/Tile, Accordion/Item, Accordion (list), Pagination (dots/counter), Pagination/Pages, Heading group, Card/Person, Check item, Card/Partner, Card/Hero tile, Card/Industry step, Accordion/Challenge, Card/Post, Model step, Model word, Card/Recommendation, Badge/Circular, Social row, Card/Testimonial, Card/Product, Card/Training, Card/Contact.
- **Organisms:** Carousel (2/3/4 items × 3 navigation placements, mobile), Call to action (5 variants), Header (default/scrolled/link states/open), Mega menu, Footer, Buy box, Mobile menu.
- **Sections:** Hero, Challenges, Blog grid, Evolution model, Industry carousel, Photo fan, Text + image, Testimonials, Numbers, Logo strip, Latest posts, Programs, Contact, Blog header, Post header, Article, Related posts, 404, Shop banner, Trust bar, Product list, FAQ.
- Each component has Desktop/Mobile and state variants, a legend describing behaviour, and a dark-mode preview.

**DCC site code** (the behaviour reference when a Figma legend isn't enough):

- Tokens are defined in `theme.json` (Polish slugs) and in `assets/css/base.css` (`--dcc-*`).
- 33 ACF blocks in `blocks/*/render.php` + `style.css`.
- Shared CSS lives in `assets/css/components/`. Carousels use Swiper (`assets/js/carousel.js`), animations use GSAP, page transitions use Swup.
- There's no npm/build.
- The rule "no raw hex/px in block CSS, only `var()`" is in `docs/konwencje.md`.

**Omelanski** (`E:\projekty\omelanski`, Astro):

- All tokens are in `src/styles/tokens.css`.
- Fonts: Source Serif 4 (body), Barlow (brand), JetBrains Mono.
- Colours: accent `#2a5db0`; light mode cream `#f6f0e6` with ink `#12253d`; dark mode `#101a22` with surfaces `#172533`/`#1f3145`.
- Max width 1280, gutter 18 → 40 px.

**Older starters** `wp-template` and `template` are not built on. This replaces them.

## Decisions made with the owner

- English token names, the Figma ones.
- Multi-brand inside one Figma file, with the Figma file updated to support it.
- Omelanski values as the placeholder brand 2.
- Components are copied into sites, never installed.
- Figma is the source; code follows.
- Hosted on GitHub (not GitLab), with a public repo and public GitHub Pages.
- The DCC site will later be renamed to the new tokens. That is a separate project.

## How it fits together

### Token layers (Figma and code use the same names)

1. **Brand** collection, one mode per brand (DCC, Omelanski). This takes over from today's Primitives: the raw palette, font families, radii and anything else that differs per brand. To keep alias paths identical across brands, the palette uses **role-based scale names**, not hue names. Examples: `palette/brand/50…950`, `palette/accent/*`, `palette/signal/*`, `palette/neutral/0…1000`. This replaces names like `color/blue/600`.
2. **Semantic** collection, modes Light / Dark. It is unchanged in purpose: `color/brand/primary`, `color/surface/page`, `color/text/body`… alias into the Brand layer.
3. **Breakpoint** collection, modes Desktop / Mobile. It keeps type sizes, gutters and container widths. Values that differ per brand (container 1240 vs 1280, gutter) move into the Brand layer and are aliased from here.
4. **Component** collection, unchanged: shape decisions alias Semantic/Brand.

This keeps the existing file working. Frames set to a brand mode recolour every instance, the same way Light/Dark does today. The "new brand" guide on the Tokens page gets rewritten to say: add a mode to Brand and fill it in.

*Builder's latitude:* the exact role-scale names and how many steps each has. The rule they must follow is that DCC's current look doesn't change after the restructure (screenshots before and after the Figma change must match).

### Sync: Figma → repo

- `tokens/` holds DTCG-format JSON exported from the Figma variables, one file per collection, with every mode included.
- Sync runs on request through the Figma MCP connection (Claude reads the variables and writes the JSON). The Figma REST Variables API needs an Enterprise plan, so a fully unattended sync isn't possible on the current plan. *(My call; revisit if the plan changes.)*
- A small script in the repo checks the JSON: every alias resolves, every brand fills every Brand token, and no component CSS uses a token that doesn't exist.

### Build

- **Style Dictionary** (v4, DTCG) turns `tokens/` into:
  - `dist/tokens/<brand>.css`: `:root[data-brand="<brand>"]` with the brand values, plus Light/Dark under `[data-theme="dark"]`, plus Mobile overrides in a media query at the Figma breakpoint.
  - `dist/wp/<brand>.theme.json`: `settings.color.palette`, `typography.fontFamilies`/`fontSizes` (fluid where Figma has Desktop/Mobile pairs), `spacing.spacingSizes`, `layout`. Slugs are kebab-case English, e.g. `brand-primary`.
- Brand fonts are self-hosted under `brands/<brand>/fonts/` with a `fonts.css` per brand. *(My call: no Google Fonts CDN, to match DCC's self-hosting.)*
- Node + npm in this repo only. Sites never need npm, because they copy files from `dist/` and `components/`.

### Components

- Folders mirror atomic levels, and each component is one folder: `components/<atoms|molecules|organisms|sections>/<name>/` containing `<name>.css`, an optional `<name>.js`, `<name>.stories.js`, and `README.md`. The README covers the markup contract: classes, data attributes, required ARIA, and the JS init.
- CSS uses only `var(--…)` tokens and `color-mix()`, with no raw hex/px except 0/1px hairlines. This is the DCC rule, carried over.
- Stories render markup from a plain template function, so "Show code" in Storybook gives exactly the HTML a site pastes.
- JS is vanilla, initialises from `data-*` attributes, and can be loaded once per page. Carousel behaviour keeps **Swiper** (what DCC uses), loaded the same way. GSAP-driven motion from DCC is reproduced only where the Figma legend describes it as part of the component (e.g. hover waves); page transitions (Swup) are out.
- States from Figma (Hover, Focus, Active, Expanded) are shown as separate stories using a forced-state class, plus live interaction.
- Images are placeholders shipped in the repo.

### Storybook

- `@storybook/html-vite`, latest major.
- **Toolbar:** Brand (DCC / Omelanski) and Theme (Light / Dark), applied as `data-brand` / `data-theme` on the preview root and on docs pages.
- **Viewports:** Desktop 1440 and Mobile 390.
- **Addons:** a11y and docs.
- A **Tokens** docs page per layer, generated from `tokens/`, showing swatches, type scale, radii, spacing and shadows for the selected brand.
- **Sidebar order:** Foundations (tokens), Atoms, Molecules, Organisms, Sections.

### GitHub

- A new public repo under `LukaszMoszczynski` (where DCC lives), named `design-system` *(my call)*.
- A GitHub Actions workflow builds the tokens and Storybook and deploys to GitHub Pages on every push to `main`.
- The CI also runs the token check and Storybook's test runner (stories render without errors, and the a11y check passes, with failures listed).
- Commits carry no Co-Authored-By/model trailers (the owner's standing rule).

### Scope line (owner's answer)

Done = tokens + sync + build + Storybook on Pages + **all atoms, molecules and organisms** + **a few example sections** that prove the parts compose. The example sections are **Hero, Text + image, FAQ, Testimonials** *(my pick: they cover the heading group, buttons, accordion and the carousel)*. The other Figma sections are built later, when a real site needs them.

### One file per brand (owner's answer: "easy to maintain, could be a separate theme file per brand")

- **Code:** every brand is its own set of files: `tokens/brands/<brand>.json`, `brands/<brand>/fonts/`, `dist/tokens/<brand>.css`, `dist/wp/<brand>.theme.json`. Adding a brand means adding those files; nothing shared changes. A new WordPress site copies only its own brand's files.
- **Figma** *(my call)*: a brand is one mode (one column) in the Brand collection, so all brand values sit side by side in one place and the sync writes each mode out as its own brand file. If the plan's mode limit is reached, the fallback is one small Figma file per brand that holds only its Brand variables, swapped into the core library. The token names stay the same, so code doesn't change.

### Calls made while writing this up (owner to check)

- **Breakpoints:** follow DCC's real ones. Mobile token set below 782 px; layout-only switches at 1025 px stay in component CSS, as in DCC. Figma's 390/1440 frames are just the two ends.
- **Type is fluid in both outputs.** Token CSS uses `clamp()` between the Mobile and Desktop values (375 → 1200 px, as DCC's theme.json does), and theme.json uses the same fluid values, so editor and components match.
- **Dark mode is opt-in**, switched only by `[data-theme="dark"]` (no automatic OS switch). A brand may ship without dark. DCC's dark palette stays a proposal and doesn't have to look finished.
- **One alias map for all brands.** Semantic stays brand-agnostic; each brand puts its values on the shared role-scale steps (e.g. Omelanski's dark surfaces become its `palette/neutral` steps). Omelanski only has to look close, not exact.

## Order of work (for the planner)

1. Figma restructure: Brand collection with modes DCC and Omelanski, re-alias Semantic/Breakpoint, rewrite the guide, check DCC looks identical, fill in the Omelanski mode.
2. Repo, token sync and token build, then Storybook skeleton with the brand/theme toolbar and the Tokens pages, deployed to Pages. Deploying early proves the pipeline.
3. Atoms, then molecules, then organisms, then the four example sections. Each component is compared against Figma in both brands and both themes.

## Left to the builder

- Exact folder names beyond the structure above, Storybook config details, and lint/format tooling.
- How forced states are implemented, as long as the markup a site copies stays clean.
- Splitting the work into tasks and choosing the test approach (visual comparison against Figma screenshots is welcome but not required).
