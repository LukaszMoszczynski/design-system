# Card/Industry step

Figma: Molecules → Card/Industry step (`22:266`: State Default, Active). DCC: blocks/karty (`.dcc-karty--branza`).
CSS: `atoms/text/text.css`, `atoms/number/number.css` + `molecules/card-industry-step/card-industry-step.css`. No JS.

`renderCardIndustryStep({ number, title, challengeLabel, challenge, actionLabel, action, active, headingTag })` →
`<article class="ds-card-industry-step is-active?"><div class="ds-card-industry-step__card"><h3 class="ds-text ds-text--2xl ds-card-industry-step__title">…</h3><p class="ds-card-industry-step__challenge"><strong>Wyzwanie:</strong> …</p><p class="ds-card-industry-step__action"><strong>Działanie:</strong> …</p></div><div class="ds-card-industry-step__number"><span class="ds-letter-circle ds-letter-circle--industry">01</span></div></article>`.

- 413 px tall so a carousel row never jumps; the timeline is `::before`, half the slide gap past each side, so the lines of
  neighbouring slides join.
- `is-active` (the centred slide, set by the industry carousel): the card 42 px taller and blue, the number accent with
  its 9 px ring, the timeline a 2 px primary line. The card change is a CSS transition (none with reduced motion).

WordPress: `esc_html()` the texts; the carousel organism toggles `is-active`.
