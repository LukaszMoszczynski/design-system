// Carousel: the script wires window.Swiper (stubbed here) to every .ds-carousel. Without Swiper the slides stay a
// scrollable row and nothing is wired.
import { beforeEach, describe, expect, it } from 'vitest';
import { Window } from 'happy-dom';
import { loadScript } from '../helpers/load-script.js';
import { renderCarousel } from '../../components/organisms/carousel/carousel.template.js';

const SCRIPT = 'components/organisms/carousel/carousel.js';
const slides = (count) => Array.from({ length: count }, (_, index) => `<a href="#${index}">Karta ${index + 1}</a>`);

// A Swiper stand-in: records every instance with its element and params, and runs the `on` handlers it is given.
function stubSwiper(window) {
  const instances = [];
  window.Swiper = class {
    constructor(element, params) {
      this.el = element;
      this.params = params;
      this.realIndex = 0;
      this.destroyed = false;
      instances.push(this);
      params.on?.init?.(this);
      params.on?.afterInit?.(this);
    }
    slideToLoop(index) {
      this.realIndex = index;
      this.params.on?.slideChange?.(this);
    }
    slideTo(index) {
      this.slideToLoop(index);
    }
    update() {}
    destroy() {
      this.destroyed = true;
    }
  };
  return instances;
}

describe('carousel script', () => {
  let window;
  let document;
  let instances;

  beforeEach(() => {
    window = new Window({ width: 1440, height: 900 });
    document = window.document;
    instances = stubSwiper(window);
  });

  it('creates one Swiper per carousel', () => {
    document.body.innerHTML = renderCarousel({ slides: slides(5) }) + renderCarousel({ slides: slides(5), items: 2 });
    loadScript(SCRIPT, window);
    const viewports = [...document.querySelectorAll('.ds-carousel__viewport')];
    expect(instances).toHaveLength(2);
    expect(instances.map((instance) => instance.el)).toEqual(viewports);
    document.querySelectorAll('.ds-carousel').forEach((element) => expect(element.classList.contains('is-ready')).toBe(true));
  });

  it('slidesPerView from data-ds-items on desktop, 1 on mobile', () => {
    document.body.innerHTML = renderCarousel({ slides: slides(8), items: 4 });
    loadScript(SCRIPT, window);
    const { params } = instances[0];
    expect(params.slidesPerView).toBe(1);
    expect(params.breakpoints[1200].slidesPerView).toBe(4);
    // Desktop shows whole cards only: every desktop breakpoint is a whole number.
    expect(Number.isInteger(params.breakpoints[1025].slidesPerView)).toBe(true);
    expect(Number.isInteger(params.breakpoints[1200].slidesPerView)).toBe(true);
    expect(params.loop).toBe(true);
  });

  // Swiper needs ceil(slidesPerView) + 1 slides for a loop at every breakpoint, and the tablet peek (2.15) counts as 3;
  // the rule is twice the most cards in view, else the arrows rewind.
  it('loops only with at least twice the most cards in view, else rewinds', () => {
    const cases = [
      { count: 3, items: 2 }, // tablets show 2.15 → 3 in view: needs 6
      { count: 5, items: 2 },
      { count: 6, items: 2 },
      { count: 5, items: 3 },
      { count: 6, items: 3 },
      { count: 7, items: 4 },
      { count: 8, items: 4 },
    ];
    document.body.innerHTML = cases.map(({ count, items }) => renderCarousel({ slides: slides(count), items })).join('');
    loadScript(SCRIPT, window);
    expect(instances.map((instance) => instance.params.loop)).toEqual([false, false, true, false, true, false, true]);
    expect(instances.map((instance) => instance.params.rewind)).toEqual([true, true, false, true, false, true, false]);
  });

  it('reads data-ds-pagination: the counter only with counter, the dots only with dots', () => {
    document.body.innerHTML = renderCarousel({ slides: slides(6) });
    // A counter element in a dots carousel (a section's own markup) is left alone.
    document.querySelector('[data-ds-carousel-dots]').insertAdjacentHTML('afterend', '<span class="ds-carousel-controls__counter">x</span>');
    loadScript(SCRIPT, window);
    instances[0].slideToLoop(2);
    expect(document.querySelector('.ds-carousel-controls__counter').textContent).toBe('x');
    expect(document.querySelectorAll('[data-ds-dot]')[2].getAttribute('aria-current')).toBe('true');
  });

  it('only links of slides fully on screen stay in the tab order', () => {
    document.body.innerHTML = renderCarousel({ slides: slides(6), items: 3 });
    const slideElements = [...document.querySelectorAll('.ds-carousel__slide')];
    slideElements[1].querySelector('a').setAttribute('tabindex', '0'); // its own tabindex comes back as it was
    const box = (left, width) => () => ({ left, right: left + width, top: 0, bottom: 100, width, height: 100 });
    document.querySelector('.ds-carousel__viewport').getBoundingClientRect = box(0, 1000);
    // Three whole cards on screen, the fourth half out, the rest off screen.
    const place = (offset) => slideElements.forEach((slide, index) => { slide.getBoundingClientRect = box(index * 340 - offset, 320); });
    place(0);
    loadScript(SCRIPT, window);
    const links = () => slideElements.map((slide) => slide.querySelector('a').getAttribute('tabindex'));
    const hidden = () => slideElements.map((slide) => slide.getAttribute('aria-hidden'));
    expect(links()).toEqual([null, '0', null, '-1', '-1', '-1']);
    expect(hidden()).toEqual([null, null, null, 'true', 'true', 'true']);
    expect(slideElements.map((slide) => slide.getAttribute('aria-label'))).toEqual(['1 z 6', '2 z 6', '3 z 6', '4 z 6', '5 z 6', '6 z 6']);
    // One slide on: the first leaves, the fourth comes in.
    place(340);
    instances[0].params.on.transitionEnd(instances[0]);
    expect(links()).toEqual(['-1', '0', null, null, '-1', '-1']);
    expect(hidden()).toEqual(['true', null, null, null, 'true', 'true']);
    expect(slideElements[0].querySelector('a').dataset.dsUntab).toBe('');
    // Back: the first slide's link gets its tab stop back, with no tabindex left behind.
    place(0);
    instances[0].params.on.transitionEnd(instances[0]);
    expect(links()).toEqual([null, '0', null, '-1', '-1', '-1']);
    expect('dsUntab' in slideElements[0].querySelector('a').dataset).toBe(false);
  });

  it('init twice creates one Swiper', () => {
    document.body.innerHTML = renderCarousel({ slides: slides(5) });
    loadScript(SCRIPT, window);
    window.DS.carousel.init();
    window.DS.carousel.init(document);
    expect(instances).toHaveLength(1);
  });

  it('prev/next buttons get aria-labels and aria-controls', () => {
    document.body.innerHTML = renderCarousel({ slides: slides(5) });
    loadScript(SCRIPT, window);
    const track = document.querySelector('.ds-carousel__track');
    expect(track.id).not.toBe('');
    ['[data-ds-carousel-prev]', '[data-ds-carousel-next]'].forEach((selector) => {
      const button = document.querySelector(selector);
      expect(button.getAttribute('aria-label')).toBeTruthy();
      expect(button.getAttribute('aria-controls')).toBe(track.id);
    });
    expect(instances[0].params.navigation.prevEl).toBe(document.querySelector('[data-ds-carousel-prev]'));
    expect(instances[0].params.navigation.nextEl).toBe(document.querySelector('[data-ds-carousel-next]'));
  });

  it('two carousels without ids get different track ids', () => {
    document.body.innerHTML = renderCarousel({ slides: slides(5) }) + renderCarousel({ slides: slides(5) });
    loadScript(SCRIPT, window);
    const ids = [...document.querySelectorAll('.ds-carousel__track')].map((track) => track.id);
    expect(new Set(ids).size).toBe(2);
  });

  it('a dot moves the carousel and the current dot follows the slide', () => {
    document.body.innerHTML = renderCarousel({ slides: slides(5) });
    loadScript(SCRIPT, window);
    const dots = () => [...document.querySelectorAll('[data-ds-dot]')];
    expect(dots()).toHaveLength(5);
    dots()[2].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    expect(instances[0].realIndex).toBe(2);
    expect(dots().map((dot) => dot.getAttribute('aria-current'))).toEqual([null, null, 'true', null, null]);
  });

  it('the counter follows the slide', () => {
    document.body.innerHTML = renderCarousel({ slides: slides(16), pagination: 'counter' });
    loadScript(SCRIPT, window);
    const counter = document.querySelector('.ds-carousel-controls__counter');
    expect(counter.textContent).toBe('1 / 16');
    instances[0].slideToLoop(2);
    expect(counter.textContent).toBe('3 / 16');
  });

  it('a carousel in a detached container is set up once it is in the document', async () => {
    loadScript(SCRIPT, window);
    const container = document.createElement('div');
    container.innerHTML = renderCarousel({ slides: slides(5) });
    window.DS.carousel.init(container);
    window.DS.carousel.init(container);
    expect(instances).toHaveLength(0);
    document.body.append(container);
    await new Promise((resolve) => window.requestAnimationFrame(resolve));
    await new Promise((resolve) => window.requestAnimationFrame(resolve));
    expect(instances).toHaveLength(1);
  });

  // Centered (data-ds-centered, the testimonials): Swiper centres the active slide, which carries is-active (the card's
  // active look); from 1025 px every item is a whole card (an even count would cut the outer cards in half).
  it('centered: centredSlides, whole cards from 1025 px, the second slide first on desktop', () => {
    document.body.innerHTML = renderCarousel({ slides: slides(6), centered: true }) + renderCarousel({ slides: slides(6) });
    loadScript(SCRIPT, window);
    const [centered, plain] = instances.map((instance) => instance.params);
    expect(centered.centeredSlides).toBe(true);
    expect(centered.breakpoints[1025].slidesPerView).toBe(3);
    expect(centered.initialSlide).toBe(1);
    expect(plain.centeredSlides).toBeFalsy();
    expect(plain.initialSlide ?? 0).toBe(0);
  });

  it('centered: the active slide gets is-active and it follows the slide', () => {
    document.body.innerHTML = renderCarousel({ slides: slides(6), centered: true });
    loadScript(SCRIPT, window);
    const active = () => [...document.querySelectorAll('.ds-carousel__slide')].map((slide) => slide.classList.contains('is-active'));
    instances[0].realIndex = 1;
    instances[0].params.on.slideChange(instances[0]);
    expect(active()).toEqual([false, true, false, false, false, false]);
    instances[0].slideToLoop(4);
    expect(active()).toEqual([false, false, false, false, true, false]);
  });

  it('not centered: no slide gets is-active', () => {
    document.body.innerHTML = renderCarousel({ slides: slides(6) });
    loadScript(SCRIPT, window);
    instances[0].slideToLoop(2);
    expect(document.querySelectorAll('.ds-carousel__slide.is-active')).toHaveLength(0);
  });

  it('without window.Swiper the slides stay a plain row', () => {
    delete window.Swiper;
    document.body.innerHTML = renderCarousel({ slides: slides(5) });
    loadScript(SCRIPT, window);
    expect(document.querySelector('.ds-carousel').classList.contains('is-ready')).toBe(false);
  });

  it('reduced motion turns the slide speed to 0', () => {
    window.matchMedia = (query) => ({ matches: query.includes('reduce'), media: query, addEventListener() {}, removeEventListener() {} });
    document.body.innerHTML = renderCarousel({ slides: slides(5) });
    loadScript(SCRIPT, window);
    expect(instances[0].params.speed).toBe(0);
  });
});

describe('carousel template', () => {
  it('writes the data hooks and escapes the label', () => {
    const markup = renderCarousel({ slides: slides(3), items: 2, nav: 'above-right', pagination: 'counter', ariaLabel: '<b>"Programy"</b>' });
    expect(markup).toContain('data-ds-items="2"');
    expect(markup).toContain('data-ds-nav="above-right"');
    expect(markup).toContain('data-ds-pagination="counter"');
    expect(markup).toContain('&lt;b&gt;&quot;Programy&quot;&lt;/b&gt;');
    expect(markup.match(/class="ds-carousel__slide"/g)).toHaveLength(3);
  });

  it('centered writes data-ds-centered', () => {
    expect(renderCarousel({ slides: slides(3), centered: true })).toContain('data-ds-centered');
    expect(renderCarousel({ slides: slides(3) })).not.toContain('data-ds-centered');
  });

  it('falls back to 3 items, nav below and dots for unknown values', () => {
    const markup = renderCarousel({ slides: slides(3), items: 7, nav: 'left', pagination: 'bars' });
    expect(markup).toContain('data-ds-items="3"');
    expect(markup).toContain('data-ds-nav="below"');
    expect(markup).toContain('data-ds-pagination="dots"');
  });
});
