# Icon

Figma: Atoms → Icons (`3:138`). DCC: `dcc_arrow_svg()` (inc/helpers.php), the carousel arrows (`dcc_carousel_close()`), the FAQ plus/minus.

Markup (`renderIcon({ name })`, `name` one of `arrow-diagonal`, `chevron-left`, `chevron-right`, `plus`, `minus`):

```html
<svg class="ds-icon ds-icon--arrow-diagonal" viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
  <path d="M7 17 17 7M17 15V7H9"/>
</svg>
```

- The stroke is `currentColor`: the parent sets the colour. `.ds-icon` is a 24 px box; a parent resizes it
  (`.ds-button__icon .ds-icon` is 20 px, `.ds-button-arrow .ds-icon` 18 px).
- Plus and minus are two / one 12 × 1.6 bars (`stroke-width="1.6"`, square ends). Plus has the vertical bar as its second `<path>`.
- Decorative (`aria-hidden`): the button or link around it carries the accessible name.

CSS: `atoms/icon/icon.css`. No JS.
WordPress: paste the SVG as it is (it has no dynamic values); `ICON_PATHS` in the template lists every path.
