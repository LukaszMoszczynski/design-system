# Card/Program

Figma: Molecules → Card/Program (`8:113`: State Default, Hover, Focus × Viewport Desktop, Mobile). DCC: blocks/karty (`.dcc-karty--program .dcc-karta`).
CSS: `atoms/text/text.css`, `atoms/button/button.css`, `atoms/icon/icon.css` + `molecules/card-program/card-program.css`. No JS.

`renderCardProgram({ title, subtitle, text, moreText, href, headingTag })` →

```html
<a class="ds-card-program" href="/szkolenia/negocjacje/">
  <div class="ds-card-program__title-box"><h3 class="ds-text ds-text--2xl ds-card-program__title">Negocjacje handlowe</h3></div>
  <div class="ds-card-program__texts">
    <p class="ds-text ds-text--body ds-card-program__subtitle">Szkolenie otwarte · 2 dni</p>
    <p class="ds-text ds-text--body ds-card-program__text">…</p>
  </div>
  <div class="ds-card-program__footer">
    <span class="ds-button-outline">Więcej</span>
    <span class="ds-button-arrow ds-button-arrow--inverted" aria-hidden="true"><svg class="ds-icon ds-icon--arrow-diagonal" …></svg></span>
  </div>
</a>
```

- With `href` the whole card is one link with one focus ring; the pill and the arrow are decorative spans. Without `href`
  it is an `<article>` with no hover.
- Desktop: min 469 px, radius 32, the stepped title box (a band one line + 32 px tall, the lower part 71 px narrower,
  20 px radii and fillet, all drawn by CSS backgrounds; a shaped float keeps the second line clear of the step).
- Hover and keyboard focus: brand surface, on-brand texts and pill, accent arrow with the nudge.
- Phones (≤ 781 px): hugging height, radius 16, a plain title box, 9/18 pill padding, 44 px arrow.

WordPress: `esc_url()` the link, `esc_html()` the texts.
