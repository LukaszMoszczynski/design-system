# Check item

Figma: Molecules → Check item (`22:178`). DCC: `.dcc-list-check li` (assets/css/base.css), in blocks/programy and the recommendation cards.
CSS: `molecules/check-item/check-item.css`. No JS.

- `renderCheckItem({ text })` → `<li class="ds-check-item"><svg class="ds-check-item__icon" …></svg><span class="ds-check-item__text">…</span></li>`.
- `renderCheckList({ items: [text], tone })` → `<ul class="ds-check-list ds-check-list--on-brand?" role="list">…</ul>`.
  Tone `default` (text colour) or `on-brand` (white text, for a blue card).
- The icon is a 27 px accent circle with the tick in currentColor (on-brand); text 9 px after it, rows 12 px apart.

WordPress: `esc_html()` for each item; paste the tick SVG as it is.
