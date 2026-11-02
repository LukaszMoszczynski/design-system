# Card/Partner

Figma: Molecules → Card/Partner (`22:206`: Layout Grid, Carousel). DCC: blocks/karty (`.dcc-karty--narzedzie .dcc-karta`).
CSS: `atoms/text/text.css` + `molecules/card-partner/card-partner.css`. No JS.

`renderCardPartner({ title, subtitle, text, logo, logoAlt, layout, headingTag })` →
`<article class="ds-card-partner ds-card-partner--grid"><img class="ds-card-partner__logo" src alt><p class="ds-text ds-text--body ds-card-partner__subtitle">…</p><h3 class="ds-text ds-text--2xl ds-card-partner__title">…</h3><p class="ds-text ds-text--body ds-card-partner__text">…</p></article>`.

- Grid: 1 px primary border, 32 px padding, left-aligned, 2XL Medium title. Carousel: 2 px border, 16/24/32 padding,
  centred logo, subtitle and XL title; the text stays left-aligned.
- The logo is 64 px tall (`object-fit: contain`). Not a link, no states.

WordPress: `wp_get_attachment_image()` for the logo with the partner name as `alt`, `esc_html()` the texts.
