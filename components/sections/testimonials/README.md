# Testimonials

Figma: Sections → Section/Testimonials (`95:227`: Viewport Desktop, Mobile). DCC: blocks/opinie (`.dcc-opinie`,
`dcc_carousel_open(3, …, centered: true)`).
CSS: `atoms/icon/icon.css`, `atoms/text/text.css`, `atoms/carousel-controls/carousel-controls.css`,
`molecules/heading-group/heading-group.css`, `molecules/card-testimonial/card-testimonial.css`,
`organisms/carousel/carousel.css` + `sections/testimonials/testimonials.css`.
JS: `organisms/carousel/carousel.js` (needs `window.Swiper`; `data-ds-centered` keeps the active card in the middle and
marks it `is-active`); optional `base/reveal.js` (the heading lifts in with GSAP when scrolled into view).

- `renderTestimonials({ overline, title, lead, items, photo, headingTag, ariaLabel })`:
  - `overline`, `title`, `lead`: the centred Heading group (Polish defaults; Figma has no lead).
  - `items`: `[{ quote, author, role, photo? }]` (default six, so the carousel loops: twice the three in view).
  - `photo`: the photo of every card without its own. `headingTag`: `h2` (default) or `h3`.
  - `ariaLabel`: the carousel region name (default: the title).

  ```html
  <section class="ds-testimonials">
    <div class="ds-testimonials__container">
      <div class="ds-testimonials__head" data-ds-reveal><header class="ds-heading-group ds-heading-group--centered">…</header></div>
      <section class="ds-carousel" data-ds-carousel data-ds-items="3" data-ds-nav="below" data-ds-pagination="dots"
               aria-roledescription="karuzela" aria-label="Co mówią nasi klienci…" data-ds-centered data-ds-mobile-arrows="off">
        <div class="ds-carousel__clip"><div class="ds-carousel__viewport"><ul class="ds-carousel__track" role="list">
          <li class="ds-carousel__slide"><figure class="ds-card-testimonial">…</figure></li>…
        </ul></div></div>
        <div class="ds-carousel__nav"><div class="ds-carousel-controls">…</div></div>
      </section>
    </div>
  </section>
  ```

- Layout: the heading 84 px above three whole cards (24 px apart) from 1025 px, the centre one primary (carousel.js
  sets `is-active` on the active slide and its card); the controls 64 px below. With three or fewer testimonials the
  row does not centre: it locks, the controls hide and the middle card is active. Phones: the heading on the left, one card with the
  next peeking, dots only (`mobileArrows: false`), 32 px gaps. Without Swiper the cards stay a scroll-snap row with none active.

WordPress: print the markup in the block's `render.php` (`esc_html()` quote with `nl2br`, author and role; the photo
`esc_url()` with `alt=""`); enqueue Swiper before `carousel.js`.
