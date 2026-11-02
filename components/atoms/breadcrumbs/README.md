# Breadcrumbs

Figma: Atoms → Breadcrumbs (`4:90` item, `4:91` separator, `4:159` trail). DCC: `dcc_breadcrumbs()`, `.dcc-breadcrumbs` (base.css).
CSS: `atoms/breadcrumbs/breadcrumbs.css`. No JS.

`renderBreadcrumbs({ items: [{ label, href }], label })`; the last item is the current page:

```html
<nav class="ds-breadcrumbs" aria-label="Ścieżka nawigacji">
  <ol class="ds-breadcrumbs__list">
    <li class="ds-breadcrumbs__item"><a class="ds-breadcrumbs__link" href="/">Strona główna</a></li>
    <li class="ds-breadcrumbs__item"><span class="ds-breadcrumbs__current" aria-current="page">Negocjacje handlowe</span></li>
  </ol>
</nav>
```

- The › is `::after` of every item but the last (`content: '›' / ''`, so screen readers skip it); it stays at the end of
  its line when the trail wraps.
- Links: muted, primary on hover and focus (ring on a 3 px radius). Current page: bold, text colour. 24 px min height.

WordPress: loop the trail in `render.php`; `esc_url()` for hrefs, `esc_html()` for labels and the nav label.
