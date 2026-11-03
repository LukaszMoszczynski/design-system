# Mega menu

Figma: Organisms → Mega menu (`59:51`, one desktop variant). DCC: blocks/naglowek (`.dcc-mega`).
CSS: `atoms/icon/icon.css`, `atoms/button/button.css` + `organisms/mega-menu/mega-menu.css`.
JS: none of its own; `organisms/header/header.js` opens and closes it.

- `renderMegaMenu({ id, text, bestsellers, areas, allText, shop, open })`:
  - `bestsellers`: `[{ title, text, href }]` under the `text` („Szczególnie polecamy”, `p.ds-mega-menu__label`).
  - `areas`: `[{ name, links: [{ text, href }], href }]`; `href` adds the „Zobacz wszystkie” (`allText`) link.
  - `shop`: `{ title, text, buttonText, href }` (the brand band with a Light pill Button), or `null`.
  - `open`: rendered without `hidden` (the standalone story). It starts hidden inside the Header.

  ```html
  <div class="ds-mega-menu" id="ds-header-mega" data-ds-mega hidden>
    <div class="ds-mega-menu__bestsellers">
      <p class="ds-mega-menu__label">Szczególnie polecamy</p>
      <ul class="ds-mega-menu__bestseller-list" role="list"><li><a class="ds-mega-menu__bestseller" href="…"><span class="ds-mega-menu__bestseller-title">…</span><span class="ds-mega-menu__bestseller-text">…</span></a></li></ul>
    </div>
    <ul class="ds-mega-menu__areas" role="list">
      <li class="ds-mega-menu__area"><p class="ds-mega-menu__area-name">…</p><ul class="ds-mega-menu__links" role="list"><li><a class="ds-mega-menu__link" href="…">…</a></li></ul><a class="ds-mega-menu__all" href="…"><span>Zobacz wszystkie</span><svg class="ds-icon ds-icon--chevron-right" …></svg></a></li>
    </ul>
    <div class="ds-mega-menu__shop"><div class="ds-mega-menu__shop-text"><p class="ds-mega-menu__shop-title">…</p><p class="ds-mega-menu__shop-desc">…</p></div><a class="ds-button ds-button--light ds-button--pill" href="…">…</a></div>
  </div>
  ```
- 880 px wide, 24 px corners, the card shadow. Inside the Header it hangs 12 px under the bar, centred. Links turn accent
  with a 2 px underline 4 px below on hover and focus.

WordPress: the bestsellers, areas and shop link are theme options (DCC: `oferta_bestsellery`, `oferta_obszary`,
`oferta_sklep`); `esc_url()` / `esc_html()` each value.
