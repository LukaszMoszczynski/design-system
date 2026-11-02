# Carousel controls

Figma: Atoms → Carousel controls (`6:61` Pagination/Dot, `6:74` Carousel/Arrow). DCC: `dcc_carousel_close()` (inc/carousel.php), `.dcc-carousel__nav` (base.css), `assets/js/carousel.js`.
CSS: `atoms/carousel-controls/carousel-controls.css` plus `atoms/icon/icon.css`. No JS of its own: the carousel organism (Task 8) wires Swiper to the hooks.

```html
<div class="ds-carousel-controls">
  <button type="button" class="ds-carousel-arrow ds-carousel-arrow--prev" data-ds-carousel-prev aria-label="Poprzednie">…chevron-left…</button>
  <div class="ds-carousel-controls__dots" data-ds-carousel-dots>
    <button type="button" class="ds-carousel-dot" data-ds-dot="0" aria-label="Przejdź do slajdu 1" aria-current="true"></button>
    …
  </div>
  <button type="button" class="ds-carousel-arrow ds-carousel-arrow--next" data-ds-carousel-next aria-label="Następne">…chevron-right…</button>
</div>
```

Functions: `renderCarouselControls({ count, active, counter, prevDisabled, nextDisabled })`, `renderCarouselArrow({ direction, label, disabled })`,
`renderCarouselDot({ index, active })`, `renderCarouselCounter({ active, count })`.

- Arrow: 40 px hit area, 24 px chevron, muted → text colour on hover/focus; disabled (`:disabled`, `aria-disabled="true"` or
  `is-disabled`, whichever Swiper is set to use) at `--opacity-disabled`.
- Dot: 24 px target, 12 px muted dot, accent on hover/focus; the current dot (`aria-current="true"`) is 16 px accent.
  Swiper's custom pagination should print `renderCarouselDot` markup (as DCC's `renderCustom` does).
- Counter `„3 / 16”` replaces the dots when `count × 24 + 2 × 40 + 2 × 20` exceeds the carousel width (`aria-live="polite"` on the dots box).

WordPress: print the markup in `render.php`; the labels are fixed Polish strings (`esc_attr()` if translated).
