# Tag

Figma: Atoms → Navigation · Tags · Numbers → Tag (`21:135`). DCC: `.dcc-model__pills li`, `.dcc-osoba__skills li`, `.dcc-post-card__date`, `.dcc-karty--narzedzie .dcc-karta__label`.
CSS: `atoms/tag/tag.css`. No JS.

`renderTag({ text, variant, href, datetime, tag })` → `<span class="ds-tag ds-tag--soft">Przetestowany</span>`.
With `href` it is `<a class="ds-tag …" href>` (focus ring, hairline outline on hover); with `datetime` it is
`<time class="ds-tag …" datetime="2026-10-12">`; otherwise `tag` (`span` or `li`).

Variants: `soft` (page colour), `white` (card colour; the post date), `brand` (primary, 8/16, button type), `outline`
(1 px text colour), `brand-small` (primary, 4/12), `article` / `article-white` (heading font, 8 px padding, 16 px radius),
`hashtag` (white overline type over a 3 px accent line, for blue or dark backgrounds).

WordPress: `esc_html()` for the text, `esc_url()` for `href`, `esc_attr()` for `datetime` (`get_the_date('c')`).
