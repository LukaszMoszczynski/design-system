# Pagination

Figma: Molecules → Pagination (`10:150`, Type Dots / Counter) and Pagination/Pages (`25:295`).
DCC: `.dcc-carousel__nav` (assets/js/carousel.js), `.dcc-blog-lista__pagination` (`paginate_links()`).
CSS: `atoms/carousel-controls/carousel-controls.css` (dots, counter), `atoms/number/number.css` + `molecules/pagination/pagination.css` (pages). No JS.

`renderPagination({ type, count, active, current, hrefPattern, ariaLabel, nextAriaLabel })`:

- `type: 'dots' | 'counter'` prints the Carousel controls atom (prev, dots or the „3 / 16” counter, next). `active` is
  the 0-based slide. The carousel organism wires Swiper to its `data-ds-carousel-*` hooks.
- `type: 'pages'` →

  ```html
  <nav class="ds-pagination ds-pagination--pages" aria-label="Stronicowanie">
    <ul class="ds-pagination__list" role="list">
      <li><span class="ds-page-number" aria-current="page">1</span></li>
      <li><a class="ds-page-number" href="/blog/page/2/">2</a></li>
      <li class="ds-pagination__next-item"><a class="ds-pagination__next" href="/blog/page/2/" aria-label="Następna strona"><svg class="ds-icon ds-icon--chevron-right" …></svg></a></li>
    </ul>
  </nav>
  ```

  `current` is 1-based; `hrefPattern` replaces `{page}`. Numbers 8 px apart (12 px and wrapping on phones). The next link
  is left out on the last page and hidden below 782 px.

WordPress: build the list from `paginate_links( [ 'type' => 'array' ] )`, mapping `.current` to `aria-current="page"`.
