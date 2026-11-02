# Card/Contact

Figma: Molecules → Card/Contact (`130:463`: Kind Text, Social × Viewport Desktop, Mobile). DCC: blocks/kontakt.
CSS: `atoms/text/text.css`, `atoms/link/link.css`, `atoms/social-button/social-button.css` + `molecules/card-contact/card-contact.css`. No JS.

`renderCardContact({ variant, overline, values, socialItems })` →
`<div class="ds-card-contact ds-card-contact--text"><p class="ds-text ds-text--small ds-card-contact__overline">Adres</p><p class="ds-card-contact__value">ul. 5 Lipca 30/4</p><p class="ds-card-contact__value">70-376 Szczecin</p></div>`.

- `values`: `[{ text, href? }]`; with `href` (`tel:`, `mailto:`) a value is a Link (list variant) in the value type.
- `variant: 'social'` (Figma Kind): one value and the raised Social row (`socialItems`, default LinkedIn, Facebook, Instagram, YouTube).
- Soft card, radius 32, 40 px padding, 12 px gaps; the overline uppercase accent; values in the heading font Medium, XL.
  Phones (≤ 781 px): 24 px padding, radius 20, values 20 px.

WordPress: `esc_html()` the texts, `esc_url()` the links (`tel:` with the digits only).
