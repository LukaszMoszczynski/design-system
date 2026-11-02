# Card/Training

Figma: Molecules → Card/Training (`130:194`: Variant Carousel, Column, Featured, Row collapsed, Row expanded). DCC: blocks/programy.
CSS: `atoms/text/text.css`, `atoms/button/button.css`, `atoms/tag/tag.css`, `atoms/icon/icon.css`, `molecules/check-item/check-item.css` + `molecules/card-training/card-training.css`.
JS (optional, motion only): `molecules/accordion/accordion.js` animates the Row with GSAP.

`renderCardTraining({ variant, label, name, text, time, title, reasons, benefits, buttonText, href, open, headingTag })`:

- `carousel` → `<article class="ds-card-training ds-card-training--carousel">` with `p.__label`, `h3.__name`, `p.__text`, `p.__time` (card surface, on the soft programs band).
- `column` → the same with the Button (`div.__actions`) instead of the time (soft, radius 28).
- `featured` → `div.__tab` (the stepped title tab, drawn by CSS backgrounds), the Check list, `p.__benefits-title`
  (the label as a primary pill), `ul.__benefits` of outline Tags, the time.
- `row` → `<details class="ds-card-training ds-card-training--row"><summary class="ds-card-training__summary">name + plus/minus Icons</summary><div class="ds-card-training__body">text, time, full-width button</div></details>`;
  closed at rest, `open` for Figma Row expanded.

WordPress: `esc_html()` the texts, `esc_url()` the button link.
