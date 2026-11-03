// Carousel: wires window.Swiper to every .ds-carousel[data-ds-carousel] (carousel.template.js).
// - data-ds-items (2–4): whole cards per view from 1200 px; 2 whole cards at 1025–1199 px (desktop: never a peek);
//   tablets show 2 and a peek, phones 1 card with the next one peeking (the viewport is one card wide, see carousel.css).
// - loop only with at least twice as many slides as the most cards ever in view (Swiper rounds a peek up: 2.15 is 3),
//   so Swiper never warns that the loop lacks slides; otherwise the arrows rewind at the ends. With no more slides than
//   fit, Swiper locks and the controls hide (is-static).
// - data-ds-pagination: dots (aria-current follows the slide) or counter („3 / 16”).
// - The dots and the counter are the template's own markup (Carousel controls atom): the script moves aria-current and
//   the counter text, and a dot click slides there.
// - Only links in slides fully on screen are in the tab order (otherwise Tab slides the loop on for ever, WCAG 2.1.2);
//   the others leave it and come back when they slide in.
// - data-ds-centered: Swiper centres the active slide (from the second one on desktop) and the script puts is-active on
//   it, the card's active look (Card/Testimonial); from 1025 px all items are whole cards (an even count would halve the
//   outer two around a centred one).
// - prefers-reduced-motion: the slide speed is 0. The gap follows the --carousel-slide-gap token (per brand, per breakpoint).
// Without window.Swiper nothing is wired: the slides stay a scrollable row (carousel.css) and init can run again once
// Swiper has loaded. Classic script, idempotent through data-ds-ready (see components/README.md, JS convention).
(function () {
  window.DS = window.DS || {};

  const SPEED = 450; // the site's carousel speed (assets/js/carousel.js)
  const FOCUSABLE = 'a, button, input, select, textarea, [tabindex]';
  let trackCount = 0;

  function reducedMotion() {
    return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  }

  function slideGap(element) {
    return parseFloat(window.getComputedStyle(element).getPropertyValue('--carousel-slide-gap')) || 0;
  }

  function ensureId(track) {
    if (track.id) return track.id;
    let id;
    do {
      trackCount += 1;
      id = `ds-carousel-track-${trackCount}`;
    } while (document.getElementById(id));
    track.id = id;
    return id;
  }

  // Takes a slide's links out of the tab order (remembering their own tabindex) or gives them back.
  function setTabbable(slide, on) {
    slide.querySelectorAll(FOCUSABLE).forEach((node) => {
      if (!on && !('dsUntab' in node.dataset)) {
        node.dataset.dsUntab = node.getAttribute('tabindex') ?? '';
        node.setAttribute('tabindex', '-1');
      } else if (on && 'dsUntab' in node.dataset) {
        if (node.dataset.dsUntab === '') node.removeAttribute('tabindex');
        else node.setAttribute('tabindex', node.dataset.dsUntab);
        delete node.dataset.dsUntab;
      }
    });
  }

  function initCarousel(element) {
    const viewport = element.querySelector('.ds-carousel__viewport');
    const track = element.querySelector('.ds-carousel__track');
    if (!viewport || !track) return;
    element.dataset.dsReady = 'true';

    const slides = [...track.children];
    const count = slides.length;
    const items = Math.min(4, Math.max(2, Number(element.dataset.dsItems) || 3));
    const prev = element.querySelector('[data-ds-carousel-prev]');
    const next = element.querySelector('[data-ds-carousel-next]');
    const usesCounter = element.dataset.dsPagination === 'counter';
    const dots = usesCounter ? null : element.querySelector('[data-ds-carousel-dots]');
    const counter = usesCounter ? element.querySelector('.ds-carousel-controls__counter') : null;
    const centered = 'dsCentered' in element.dataset;
    const breakpoints = {
      // 782 = the phone/tablet switch of the tokens (max-width: 781px): tablets show a peek.
      782: { slidesPerView: Math.min(2, items) + 0.15 },
      // Desktop: whole cards only.
      1025: { slidesPerView: centered ? items : Math.min(2, items) },
      1200: { slidesPerView: items },
    };
    const mostInView = Math.max(1, ...Object.values(breakpoints).map((breakpoint) => Math.ceil(breakpoint.slidesPerView)));
    const loop = count >= mostInView * 2;

    const trackId = ensureId(track);
    [prev, next].forEach((button) => button?.setAttribute('aria-controls', trackId));

    function syncPagination(swiper) {
      const active = count ? swiper.realIndex % count : 0;
      dots?.querySelectorAll('[data-ds-dot]').forEach((dot, index) => {
        if (index === active) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      if (counter) counter.textContent = `${active + 1} / ${count}`;
      if (centered) slides.forEach((slide, index) => slide.classList.toggle('is-active', index === active));
    }

    // Slides fully inside the viewport (1 px of slack for rounding) keep their links tabbable. A slide wider than the
    // viewport is never fully inside: then the active one counts.
    function syncSlides(swiper) {
      const box = viewport.getBoundingClientRect();
      const inside = (slide) => {
        const rect = slide.getBoundingClientRect();
        return rect.width > 0 && rect.left >= box.left - 1 && rect.right <= box.right + 1;
      };
      const shown = slides.map(inside);
      if (!shown.some(Boolean) && count) shown[swiper.realIndex % count] = true;
      slides.forEach((slide, index) => {
        slide.setAttribute('aria-label', `${index + 1} z ${count}`);
        setTabbable(slide, shown[index]);
        if (shown[index]) slide.removeAttribute('aria-hidden');
        else slide.setAttribute('aria-hidden', 'true');
      });
    }

    function sync(swiper) {
      syncPagination(swiper);
      syncSlides(swiper);
    }

    const swiper = new window.Swiper(viewport, {
      wrapperClass: 'ds-carousel__track',
      slideClass: 'ds-carousel__slide',
      loop,
      rewind: !loop,
      speed: reducedMotion() ? 0 : SPEED,
      slidesPerView: 1,
      spaceBetween: slideGap(element),
      watchOverflow: true,
      watchSlidesProgress: true,
      centeredSlides: centered,
      // Desktop shows the second card in the middle, as in Figma; a phone starts at the first.
      initialSlide: centered && count > 2 && window.innerWidth >= 1200 ? 1 : 0,
      breakpoints,
      navigation: { prevEl: prev, nextEl: next, disabledClass: 'is-disabled', lockClass: 'is-locked', hiddenClass: 'is-hidden' },
      a11y: {
        prevSlideMessage: prev?.getAttribute('aria-label') || 'Poprzednie',
        nextSlideMessage: next?.getAttribute('aria-label') || 'Następne',
        slideLabelMessage: '{{index}} z {{slidesLength}}',
        slideRole: null, // the slides are <li> items of the track's list
      },
      on: {
        afterInit: sync,
        slideChange: syncPagination,
        transitionEnd: syncSlides,
        resize: syncSlides,
        // The gap token changes at the phone breakpoint (and per brand): read it before Swiper measures again.
        beforeResize: (instance) => {
          instance.params.spaceBetween = slideGap(element);
        },
        lock: () => element.classList.add('is-static'),
        unlock: () => element.classList.remove('is-static'),
      },
    });

    dots?.addEventListener('click', (event) => {
      const dot = event.target.closest?.('[data-ds-dot]');
      if (dot) swiper.slideToLoop(Number(dot.dataset.dsDot));
    });
    element.classList.add('is-ready');
  }

  // A carousel not yet in the document (markup built in a detached container, as Storybook's decorator does) is set up
  // on the next frame, once it is: Swiper measures nothing while detached.
  function initWhenConnected(element) {
    if (element.isConnected) initCarousel(element);
    else window.requestAnimationFrame(() => {
      if (element.isConnected && !element.dataset.dsReady) initCarousel(element);
    });
  }

  function init(root = document) {
    if (!window.Swiper) return; // stays a scrollable row; init again once Swiper is there
    root.querySelectorAll('.ds-carousel[data-ds-carousel]:not([data-ds-ready])').forEach(initWhenConnected);
  }

  window.DS.carousel = { init };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();
})();
