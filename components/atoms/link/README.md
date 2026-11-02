# Link

Figma: Atoms → Link · Label → Link (`4:49`). DCC: `.dcc-karta__links a`, `.dcc-btn--link`, `.dcc-karty--obszar .dcc-karta__more`, `.dcc-footer a`.
CSS: `atoms/link/link.css` plus `atoms/icon/icon.css`. No JS.

`renderLink({ text, href, kind })`, `kind` one of `inline`, `arrow`, `brand`, `footer`, `bold`, `inverse`:

```html
<a class="ds-link ds-link--inline" href="/kontakt/">Zobacz szczegóły</a>
<a class="ds-link ds-link--arrow" href="/blog/">
  <span class="ds-link__label">Zobacz szczegóły</span><svg class="ds-icon ds-icon--arrow-diagonal" …></svg>
</a>
```

| Kind | Rest | Hover / focus |
| --- | --- | --- |
| inline | text colour | primary |
| arrow | text colour, 14 px arrow | accent, arrow nudges |
| brand | primary, 12 px arrow | primary, arrow nudges |
| footer | white (on the blue footer card) | accent |
| bold | bold text colour, 14 px arrow | accent, arrow nudges |
| inverse | bold white, 14 px arrow (blue surfaces) | arrow nudges |

Focus adds the 2 px ring 3 px outside, on a 3 px radius.
WordPress: `esc_url()` for `href`, `esc_html()` for the text.
