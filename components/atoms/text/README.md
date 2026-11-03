# Text

Figma: Atoms → Text (`4:81`). DCC: the heading and text styles in `assets/css/base.css` / theme.json.
CSS: `atoms/text/text.css`. No JS.

`renderText({ text, strong, variant, mobile, tone, tag, className })` → `<h2 class="ds-text ds-text--4xl">…</h2>`. `strong` appends a bold closing sentence (`<strong>`); `className` adds the placing molecule's class.
Variants (Figma Style): `4xl`, `3xl`, `2xl`, `2xl-medium` (Heading/2XL medium), `xl`, `lg`, `lead-large` (Text/Lead large Ubuntu), `body`, `body-bold`, `small`, `overline`, `number`, `button`, `question`.
The variant is the look, the tag the HTML level. Sizes are fluid tokens (desktop → mobile in one class), so Figma's
Viewport=Mobile is the same class at 390 px. Overline is uppercase, tracked 6 % of its size.
`mobile`: a second variant for phones (≤ 781 px, `ds-text--mobile-{variant}`), where a design changes the style itself
(Section/Hero: the 4XL title reads 3XL, the subpage title an overline, the 2XL subtitle body text).

Colour: `.ds-text` inherits the surface's colour (page, blue card, Dark), so a heading in a blue card needs nothing.
`tone` picks a text token where the design uses one: `default`, `muted`, `primary`, `accent`, `on-brand`
(`ds-text--{tone}`); `inherit` (the default) adds no class.

WordPress: `esc_html()` for the text; pick the tag in `render.php`.
