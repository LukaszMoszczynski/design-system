# Card/Product

Figma: Molecules → Card/Product (`102:116`: Variant Standard, Compact, Rows). DCC: blocks/sklep-lista (`.dcc-sklep-karta`).
CSS: `atoms/label/label.css`, `atoms/text/text.css`, `atoms/button/button.css`, `atoms/link/link.css`, `atoms/icon/icon.css` + `molecules/card-product/card-product.css`. No JS.

`renderCardProduct({ title, text, meta, price, oldPrice, badge, image, moreText, href, variant, headingTag })` →
`<a class="ds-card-product ds-card-product--standard" href><div class="ds-card-product__media"><img class="ds-card-product__image" src alt=""></div><div class="ds-card-product__body"><span class="ds-label ds-label--accent">Polecane</span><h3 class="ds-text ds-text--xl ds-card-product__title">…</h3><p class="ds-text ds-text--body ds-card-product__text">…</p><p class="ds-text ds-text--body ds-card-product__meta">…</p><div class="ds-card-product__foot"><p class="ds-card-product__price"><span class="ds-card-product__current-price">1 490 zł</span> <s class="ds-card-product__old-price">1 990 zł</s></p><span class="ds-button ds-button--primary ds-button--pill">…</span></div></div></a>`.

- The whole card is one link with one focus ring; the Zobacz button (Button atom with `tag: 'span'`) and the Compact
  Zobacz text link (Link atom without `href`) are decorative.
- `badge`: a Badge pill variant (`polecane`, `promocja`, `akcja`) or empty. `oldPrice` shows on Standard only.
- Compact: a 168 px framed square thumbnail beside the body. Rows: a 280 × 176 photo, the body, a 180 px column with
  the price above the button. Phones (≤ 781 px): every variant stacks like Standard.
- Hover and focus: the photo zooms 5 %, the button shows its hover gradient, the text link nudges its arrow.

WordPress: from the product (`get_permalink()`, `wc_price()`, the sale price as `oldPrice`), `esc_html()` the texts.
