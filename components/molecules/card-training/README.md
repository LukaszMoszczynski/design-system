# Card/Training

Figma: Molecules → Card/Training (`130:194`: Variant Carousel, Column, Featured, Row collapsed, Row expanded). DCC: blocks/programy.
CSS: `atoms/text/text.css`, `atoms/button/button.css`, `atoms/tag/tag.css`, `atoms/icon/icon.css`, `molecules/check-item/check-item.css`, `molecules/benefits/benefits.css`, `molecules/accordion/accordion.css` (the summary) + `molecules/card-training/card-training.css`.
JS (optional, motion only): `molecules/accordion/accordion.js` animates the Row with GSAP.

`renderCardTraining({ variant, overline, name, text, time, title, reasons, benefitsTitle, benefits, buttonText, href, open, headingTag })`:

- `carousel` → `<article class="ds-card-training ds-card-training--carousel">` with `p.__overline`, `h3.__name`, `p.__text`, `p.__time` (card surface, on the soft programs band).
- `column` → the same with the Button (`div.__actions`) instead of the time (soft, radius 28).
- `featured` → `div.__tab` (the stepped title tab, drawn by CSS backgrounds), the Check list, the Benefits molecule
  (`benefitsTitle` as the pill, `benefits` as outline pills), the time.
- `row` → `<details class="ds-details ds-card-training ds-card-training--row"><summary class="ds-accordion-summary ds-card-training__summary">…</summary><div class="ds-card-training__body">text, time, full-width button</div></details>`;
  closed at rest, `open` for Figma Row expanded. The summary is the shared `renderAccordionSummary` (Accordion README).

WordPress: `esc_html()` the texts, `esc_url()` the button link.
