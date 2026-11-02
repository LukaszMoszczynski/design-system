# Carousel

Figma: Organisms → Carousel (`12:807`: Items 2 / 3 / 4 × Navigation Below / Beside heading / Above right, + Viewport Mobile).
DCC: `dcc_carousel_open()` / `dcc_carousel_close()` (inc/carousel.php), assets/js/carousel.js, `.dcc-carousel` (base.css).
CSS: `atoms/icon/icon.css`, `atoms/text/text.css`, `atoms/carousel-controls/carousel-controls.css`,
`molecules/heading-group/heading-group.css`, the CSS of the cards in the slides + `organisms/carousel/carousel.css`.
JS: `organisms/carousel/carousel.js` (needs `window.Swiper`, Swiper 11).

- `renderCarousel({ slides, items, nav, pagination, heading, ariaLabel, id })`:
  - `slides`: an array of markup strings, one card each (any card template: `renderCardProgram`, `renderCardTile`,
    `renderCardPost`…). Each goes into an `li.ds-carousel__slide`.
  - `items` (`2`, `3`, `4`; default 3): whole cards per view from 1200 px (`data-ds-items`).
  - `nav` (`below`, `beside-heading`, `above-right`; default below): where the controls sit (`data-ds-nav`).
  - `pagination` (`dots`, `counter`; default dots): one dot per slide, or the „3 / 16” counter (`data-ds-pagination`).
  - `heading`: the Heading group args (`overline`, `title`, `lead`, `leadStrong`, `headingTag`, `variant`), or `null`.
    With `nav: 'above-right'` the group is split unless `heading.variant` says otherwise.
  - `ariaLabel`: the region name (default: the heading title, else „Karuzela”). `id`: the track id (aria-controls of
    the arrows); the script makes one when it is empty.

  ```html
  <section class="ds-carousel ds-carousel--nav-below" data-ds-carousel data-ds-items="3" data-ds-nav="below"
       data-ds-pagination="dots" aria-roledescription="karuzela" aria-label="Programy…">
    <div class="ds-carousel__head"><header class="ds-heading-group ds-heading-group--stacked">…</header></div>
    <div class="ds-carousel__clip">
      <div class="ds-carousel__viewport">
        <ul class="ds-carousel__track" role="list">
          <li class="ds-carousel__slide"><a class="ds-card-program" href="…">…</a></li>
          …
        </ul>
      </div>
    </div>
    <div class="ds-carousel__nav"><div class="ds-carousel-controls">…prev, dots, next…</div></div>
  </section>
  ```

  The named `<section>` is the region landmark; the Heading group's `<header>` inside it is not a banner.
  `beside-heading` puts `div.ds-carousel__nav` inside `div.ds-carousel__head`, after the heading group; `above-right`
  puts it between the head and the clip.
- Layout:
  - Desktop shows whole cards only: `items` per view from 1200 px, 2 at 1025–1199 px.
  - Tablets (782–1024 px) show 2 cards and a peek.
  - Phones show one card (`--size-card-width`, 331 px) with the next one peeking; the clip runs on to the screen edge
    and the controls always sit below.
- `carousel.js` (`window.DS.carousel.init(root)`):
  - creates one Swiper per `.ds-carousel[data-ds-carousel]`, on `.ds-carousel__viewport`;
  - `loop` only when there are more slides than `items`. With fewer, Swiper locks and the controls hide (`is-static`);
  - the gap is the `--carousel-slide-gap` token (per brand and breakpoint), read again on resize;
  - the arrows get `aria-controls` (the track id); a dot click slides there, the current dot gets `aria-current`, the
    counter text follows the slide;
  - only the links of slides fully on screen stay in the tab order (WCAG 2.1.2); the others come back when they slide in;
  - `prefers-reduced-motion: reduce`: speed 0 (instant). Swiper does the motion, not GSAP;
  - without `window.Swiper` nothing is wired: the slides stay a row that scrolls sideways with snap, the controls are
    hidden. Call `init()` again once Swiper has loaded. It is idempotent (`data-ds-ready`).

WordPress: print the markup in the block's `render.php`; each card is the card block's own markup. Enqueue Swiper
(`swiper-bundle.min.js`, only its JS is needed) before `carousel.js`. `esc_attr()` the `aria-label`; `items`, `nav` and
`pagination` are block options printed into the data attributes.
