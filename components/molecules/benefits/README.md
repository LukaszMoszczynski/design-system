# Benefits

Figma: the benefits block of Card/Recommendation (`25:388`) and Card/Training Featured (`130:179`). DCC: `.dcc-program__benefits-title`, `.dcc-program__benefits` (blocks/programy).
CSS: `atoms/tag/tag.css`, `atoms/icon/icon.css` + `molecules/benefits/benefits.css`. No JS.

`renderBenefits({ title, items, chevron, variant })` →

```html
<div class="ds-benefits ds-benefits--default">
  <p class="ds-benefits__title">3 główne korzyści<svg class="ds-icon ds-icon--chevron-right" …></svg></p>
  <ul class="ds-benefits__list" role="list"><li class="ds-tag ds-tag--outline">…</li></ul>
</div>
```

- The title is a primary pill (body bold, on-brand); `chevron` adds the 24 px chevron (Card/Recommendation).
- The items are outline Tag pills in currentColor, 3/12 padding, 6 px apart, stacked; a long benefit wraps.
- `variant: 'on-brand'` (a blue card): an accent pill, the pills flowing in rows.
- The placing card sets the gap above it.

WordPress: `esc_html()` the title and each item.
