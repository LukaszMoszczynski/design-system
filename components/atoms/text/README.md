# Text

Figma: Atoms → Text (`4:81`). DCC: the heading and text styles in `assets/css/base.css` / theme.json.
CSS: `atoms/text/text.css`. No JS.

`renderText({ text, style, tag })` → `<h2 class="ds-text ds-text--4xl">…</h2>`.
Styles: `4xl`, `3xl`, `2xl`, `xl`, `lg`, `body`, `body-bold`, `small`, `overline`, `number`, `button`, `question`.
The style is the look, the tag the HTML level. Sizes are fluid tokens (desktop → mobile in one class), so Figma's
Viewport=Mobile is the same class at 390 px. Overline is uppercase, tracked 6 % of its size.

WordPress: `esc_html()` for the text; pick the tag in `render.php`.
