# Numbered list

Figma: Sections → Section/Text + image, Variant Image left ("Numbered list", `91:90`). DCC: `.dcc-tekst-obraz__list`
(blocks/tekst-obraz).
CSS: `atoms/text/text.css`, `atoms/number/number.css` + `molecules/numbered-list/numbered-list.css`. No JS.

`renderNumberedList({ items })` (`items`: strings, numbered from 1) →
`<ol class="ds-numbered-list" role="list"><li class="ds-numbered-list__item"><span class="ds-letter-circle ds-letter-circle--step">1</span><span class="ds-text ds-text--2xl-medium ds-numbered-list__text">…</span></li>…</ol>`.

- Rows: a 49 px Letter circle and a 2XL medium line 34 px apart, 16 px vertical padding, a 1 px strong-border divider
  (none on the last).
- Hover (a pointer): the number turns accent and scales 1.18; with reduced motion only the colour changes.

WordPress: one `<li>` per line of the field, `esc_html()` the text; the number is the row index + 1.
