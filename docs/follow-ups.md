# Follow-ups after the first build (2026-11-03)

Collected from the build ledger. None of these block use; the final review triaged them as can-wait. "Figma cleanup" items are changes in the Figma file, then a token sync.

## Figma cleanup
- Figma code-syntax hygiene (115 non-var syntaxes incl. `--dcc-radius-md`, raw CSS like `min-height: 800px`, 61 missing) is deferred to a Figma cleanup at the end (before Task 10) — not blocking the build since names derive from paths — cost if wrong: Figma Dev Mode shows stale names meanwhile
- brand-prefixed Figma code syntax is ignored by write-tokens (path name used); build throws on duplicates/brand prefixes — Figma data had --dcc-* leftovers — cost if wrong: names differ from Figma Dev Mode until the Figma cleanup
- (T4) color/shadow-card|lift are raw violet values in Semantic, so Omelanski gets DCC-tinted shadows; should alias a Brand palette step
- (T4) Tokens page label "black 18 %" and effect style descriptions out of date
- (T4) effects.json descriptions stale (--dcc-shadow, rgba text)
- CTA Gradient dark end on --palette-secondary-800 accepted for now; add Semantic role (e.g. color/surface/deep) in the Figma cleanup — Figma's own Dark preview unreadable with the role token — cost if wrong: one CSS var swap later
- missing tokens (hero illustration size/offsets, subpage gradient deep end, 1140 heading width, 84 gap, badge offsets) as spacing-scale calcs marked in CSS → Figma cleanup list — cost: values drift from Figma until tokens exist
- 115 Figma code syntaxes are not plain var(--x) (e.g. raw CSS like min-height: 800px), and 61 variables have none. CSS names come from the path, so the build is unaffected.
- Missing tokens marked in CSS: hero illustration size/offsets, subpage gradient deep end, 1140 px heading width, 84 px testimonials gap, Photos badge offsets; motion durations (0.15s/0.2s).

## Code (can wait)
- (T1) Step 5 preview didn't show cream page bg visually (resolved value verified)
- (T1) guide footnote 16:454 kept
- (T2) check-tokens resolves aliases against union of files (no cross-collection collision / cycle check)
- (T2) figma-export chunking via hand-edited ONLY/FROM/TO + manual merge can silently produce a partial export — add expected counts
- (T2) colour rounded to 4 decimals before hex
- (T2) test temp dir not cleaned; single-mode file naming not asserted
- (T3) serif body falls back to sans-serif stack
- (T3) brand mismatch in fluid values only warns
- (T3) theme.json font-size names uppercased; slugs like 4xl → WP "4-xl"
- (T3) redundant fluid where min==max
- (T3) Windows-only path hack in test; no omelanski output test beyond fix
- (T3) parseFloat assumes px
- (T3) missing space in writeFileSync call
- (T4) JetBrains Mono duplicated per brand folder (self-contained by design)
- (T4) CI actions v4 on deprecated Node 20 warning
- (T4) token-list aliases/descriptions only from dcc/desktop/light
- (T4) foundations.css duplicate .ds-space-bar + hardcoded px on docs page
- (T4) unused data-showing attr in blocks.jsx
- (T4) base.template.js interpolates args unescaped (convention template)
- (T4) README path pattern vs components/base/
- (T4) pages-paths regex misses single-quoted src and href="/
- (T4) react only transitive dependency
- (T4) Dark alias line under semantic swatches shows Light alias
- (T5) inline style= in templates not checked
- (T5) token-usage defined() counts names in comments / any block
- (T5) unit list lacks dv*/sv*/lv* and r* units
- (T5) @import media false positive; ; inside url(data:) truncates
- (T5) story-contract regex misses async/var render exports
- (T5) init(root) doesn't match root itself; DOMContentLoaded branch untested
- (T5) no escapeHtml unit test; README lacks not-URL-safe warning
- (T5) no RED run (mutation check instead)
- (T5) selector guard skips classes inside :not()/:is(); story wrapped in display:contents div
- (T6) raw 0.15s/0.2s durations — no motion tokens
- (T6) atoms borrow other components' tokens; calc hacks on space tokens
- (T6) surface tokens used as text colours
- (T6) search field error aria-describedby to unrendered message
- (T6) stepper/newsletter controls lack own focus-visible ring
- (T6) hard-coded strings (dot label, Mniej/Więcej, target=_blank on social)
- (T6) renderFormField defaults inconsistent
- (T6) is-active/.is-disabled state classes — document as allowed exception
- (T6) newsletter required fixed, no id arg
- (T7) accordion tween to scrollHeight excludes border (1px jump)
- (T7) name→data-ds-group switch only at init (reduced-motion later / find-in-page)
- (T7) gsap test stub completes instantly; mid-animation reversal untested
- (T7) overflow hidden clips summary focus ring during tween
- (T7) Card/Product copies button hover gradient; two cards copy arrow nudge
- (T7) .is-blue stale in comment/README
- (T7) pagination ariaLabel unused for dots/counter
- (T7) badge-circular 'icon' arg naming; state-control play check only on Card Program
- (T7b) button-arrow Playground default href '#' hides decorative span form; number page hover only in Overview; tag Link example overlaps Playground; nav-link/link Playground lack a11y todo for forced accent states
- (T8) mega menu stays open when narrowed <1025; Escape focuses hidden toggle
- (T8) hover-opened panel + Enter pins instead of closing (shared hoverOpened flag)
- (T8) scroll lock pads only <html>; fixed elements shift at 782–1024
- (T8) Playground lacks header mega/mobileMenu, carousel id, buy box disabled controls
- (T8) buy-box.js hard-codes "Razem:", "brutto"/"netto"
- (T8) logo/badge markup near-duplicated in header & footer
- (T8) header bar z-index 10 vs drawer z-index unchecked
- (T9) some workaround calcs unmarked; spacing tokens used as sizes
- (T9) start-on-second-card reads window width once
- (T9) Sections/Overview shows one variant per section (misses subpage gradients / Photos badge Dark issues)
- (T9) has-photo/is-active state classes without ds- (per convention)
- (T9) hero.css font-size:0 wrapper trick fragile

## From the final review
- M2: with GSAP loaded, reveal content stays hidden in print / full-page capture / container-scrolling themes. Add a print reset and a README note.
- M5: CI checks a11y only in DCC Light.
- M6: CI doesn't check that dist/ is up to date.
- @storybook/test-runner 0.26 is end-of-life upstream; the Vitest addon is the successor (owner call).
