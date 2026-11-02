# Text

Figma: Atoms → Text (`4:81`). DCC: the heading and text styles in `assets/css/base.css` / theme.json.
CSS: `atoms/text/text.css`. No JS.

`renderText({ text, variant, tone, tag })` → `<h2 class="ds-text ds-text--4xl">…</h2>`.
Variants (Figma Style): `4xl`, `3xl`, `2xl`, `xl`, `lg`, `body`, `body-bold`, `small`, `overline`, `number`, `button`, `question`.
The variant is the look, the tag the HTML level. Sizes are fluid tokens (desktop → mobile in one class), so Figma's
Viewport=Mobile is the same class at 390 px. Overline is uppercase, tracked 6 % of its size.

Colour: `.ds-text` inherits the surface's colour (page, blue card, Dark), so a heading in a blue card needs nothing.
`tone` picks a text token where the design uses one: `default`, `muted`, `primary`, `accent`, `on-brand`
(`ds-text--{tone}`); `inherit` (the default) adds no class.

WordPress: `esc_html()` for the text; pick the tag in `render.php`.
