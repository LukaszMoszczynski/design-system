# Card/Hero tile

Figma: Molecules → Card/Hero tile (`22:241`: State Default, Hover, Focus; Viewport Mobile). DCC: blocks/hero (`.dcc-hero__tile`).
CSS: `atoms/text/text.css`, `atoms/tag/tag.css`, `atoms/link/link.css`, `atoms/button/button.css`, `atoms/icon/icon.css` + `molecules/card-hero-tile/card-hero-tile.css`. No JS.

`renderCardHeroTile({ title, hashtag, text, linkText, href, headingTag })` →

```html
<a class="ds-card-hero-tile" href="/oferta/">
  <h3 class="ds-text ds-text--xl ds-card-hero-tile__title">Oferta szkoleń wewnętrznych</h3>
  <span class="ds-tag ds-tag--hashtag">#rozwijamySzczecin</span>
  <p class="ds-text ds-text--body ds-card-hero-tile__text">…</p>
  <span class="ds-link ds-link--bold"><span class="ds-link__label">Czytaj najnowsze artykuły</span><svg …></svg></span>
  <span class="ds-button-arrow" aria-hidden="true"><svg …></svg></span>
</a>
```

- The whole tile is one link with one focus ring; the text link (Link atom without `href`, a span) and the corner arrow are
  decorative. Without `href`: an `<article>`, no arrow, no states. Empty `hashtag` / `linkText` leave them out (Figma Show tag / Show link).
- Desktop (≥ 1025 px) hover: brand surface, rises 20 px, the page-colour notch opens in the bottom-right corner (CSS
  gradients in `::before`) and the arrow moves into it. Focus: the hover colours and rise without the notch, ring 3 px outside.
- Below 1025 px: 24/20 padding, radius 16, hugging height, no corner arrow.

WordPress: `esc_url()` the link, `esc_html()` the texts.
