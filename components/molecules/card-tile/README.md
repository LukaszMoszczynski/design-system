# Card/Tile

Figma: Molecules → Card/Tile (`8:138`: State Default, Hover, Focus). DCC: blocks/karty (`.dcc-karty--akredytacja .dcc-karta`).
CSS: `atoms/text/text.css` + `molecules/card-tile/card-tile.css`. No JS.

`renderCardTile({ title, subtitle, text, href, headingTag })` →
`<a class="ds-card-tile" href><div class="ds-card-tile__title-box"><h3 class="ds-text ds-text--2xl ds-card-tile__title">…</h3></div><div class="ds-card-tile__texts"><p class="ds-text ds-text--body ds-card-tile__subtitle">…</p><p class="ds-text ds-text--body ds-card-tile__text">…</p></div></a>`
(an `<article>` without `href`).

- Soft surface, radius 32, padding 40 28 44 16. The title box (8/16/12 padding, radius 20) is transparent at rest.
- Hover and keyboard focus (as a link): brand surface, on-brand texts, the title box in the page colour with a primary title.

WordPress: `esc_url()` the link, `esc_html()` the texts.
