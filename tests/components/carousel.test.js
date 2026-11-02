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
    document.body.innerHTML = renderCarousel({ slides: slides(6), items: 4 });
    loadScript(SCRIPT, window);
    const { params } = instances[0];
    expect(params.slidesPerView).toBe(1);
    expect(params.breakpoints[1200].slidesPerView).toBe(4);
    // Desktop shows whole cards only: every desktop breakpoint is a whole number.
    expect(Number.isInteger(params.breakpoints[1025].slidesPerView)).toBe(true);
    expect(Number.isInteger(params.breakpoints[1200].slidesPerView)).toBe(true);
    expect(params.loop).toBe(true);
  });

  it('loops only when there are more slides than items', () => {
    document.body.innerHTML = renderCarousel({ slides: slides(3), items: 3 }) + renderCarousel({ slides: slides(4), items: 3 });
    loadScript(SCRIPT, window);
    expect(instances.map((instance) => instance.params.loop)).toEqual([false, true]);
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

  it('falls back to 3 items, nav below and dots for unknown values', () => {
    const markup = renderCarousel({ slides: slides(3), items: 7, nav: 'left', pagination: 'bars' });
    expect(markup).toContain('data-ds-items="3"');
    expect(markup).toContain('data-ds-nav="below"');
    expect(markup).toContain('data-ds-pagination="dots"');
  });
});
