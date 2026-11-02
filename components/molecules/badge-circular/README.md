# Badge/Circular

Figma: Molecules → Badge/Circular (`51:51`). DCC: `dcc_badge()` (inc/helpers.php), `.dcc-badge` (assets/css/base.css), blocks/wezwanie.
CSS: `atoms/icon/icon.css` + `molecules/badge-circular/badge-circular.css`. No JS.

`renderBadgeCircular({ text, icon, id, className })` (`icon`: `arrow` | `check`; `className`: the placing component may resize or recolour it, e.g. the recommendation card) →

```html
<span class="ds-badge-circular" role="img" aria-label="Wyzwanie? Znajdziemy rozwiązanie">
  <svg class="ds-badge-circular__ring" viewBox="-80 -80 160 160" aria-hidden="true" focusable="false">
    <circle class="ds-badge-circular__disc" r="80"/>
    <path id="ds-badge-path-1" d="M0,-58 a58,58 0 1,1 -0.1,0" fill="none"/>
    <text class="ds-badge-circular__text"><textPath href="#ds-badge-path-1" textLength="358" lengthAdjust="spacing">…</textPath></text>
  </svg>
  <span class="ds-badge-circular__dot"><svg class="ds-icon ds-icon--arrow-diagonal" …></svg></span>
</span>
```

- 160 px card-colour disc, the wording on a 58 px radius (heading font Medium 16, 6 % tracking, text colour), a centred
  accent dot (35 % of the badge) with an on-brand arrow or check. The wording turns once in 16 s unless `prefers-reduced-motion: reduce`.
- `id` names the text path; left empty, the template numbers it (`ds-badge-path-N`). Give a stable id when the page
  prints several badges from PHP.

WordPress: `esc_attr()` for `aria-label`, `esc_html()` inside `textPath`, a unique path id per badge (`wp_unique_id()`).
