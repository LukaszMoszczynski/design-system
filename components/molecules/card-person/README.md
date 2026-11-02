# Card/Person

Figma: Molecules → Card/Person (`22:189`: State Default, Hover). DCC: blocks/osoby (`.dcc-osoby--siatka .dcc-osoba`).
CSS: `atoms/text/text.css` + `molecules/card-person/card-person.css`. No JS.

`renderCardPerson({ name, roles, image, imageAlt, href, headingTag })` →
`<a class="ds-card-person" href><span class="ds-card-person__photo"><img src alt="" loading="lazy"></span><div class="ds-card-person__body"><h3 class="ds-text ds-text--2xl ds-card-person__name">Anna Grygorcewicz</h3><p class="ds-card-person__roles">line<br>line</p></div></a>`
(an `<article>` without `href`).

- 454 px tall (346 on phones), radius 32; the portrait covers the card, the muted surface shows without one.
- The name box: page colour, radius 16, 16/28 padding, 20 px from the edges, centred; the name in the heading font Medium
  at the 2XL size, primary.
- Hover and keyboard focus zoom the photo 4 %.

WordPress: `wp_get_attachment_image()` for the portrait (`alt=""`: the name names the card), `esc_html()` per role line.
