// Scroll reveal: with window.gsap + window.ScrollTrigger an element marked data-ds-reveal below the fold fades and lifts
// in when it scrolls into view (the site's 1 s power4.out, 60 px). Without them, with reduced motion, or already on
// screen it is left as it is.
import { beforeEach, describe, expect, it } from 'vitest';
import { Window } from 'happy-dom';
import { loadScript } from '../helpers/load-script.js';

const SCRIPT = 'components/base/reveal.js';

describe('reveal script', () => {
  let window;
  let document;
  const items = () => [...document.querySelectorAll('[data-ds-reveal]')];
  // happy-dom lays nothing out: place the elements below the fold by hand.
  const belowTheFold = (element, top = 2000) => {
    element.getBoundingClientRect = () => ({ top, bottom: top + 100, left: 0, right: 100, width: 100, height: 100 });
  };

  function stubGsap() {
    const calls = [];
    window.gsap = {
      fromTo(target, from, to) {
        calls.push({ target, from, to });
        return { kill() {}, scrollTrigger: null };
      },
      set() {},
    };
    window.ScrollTrigger = {};
    return calls;
  }

  beforeEach(() => {
    window = new Window({ width: 1440, height: 900 });
    document = window.document;
    document.body.innerHTML = '<div data-ds-reveal>Raz</div><div data-ds-reveal>Dwa</div>';
    items().forEach((element) => belowTheFold(element));
  });

  it('works without gsap', () => {
    loadScript(SCRIPT, window);
    expect(typeof window.DS.reveal.init).toBe('function');
    items().forEach((element) => {
      expect(element.dataset.dsReady).toBe('true');
      expect(element.getAttribute('style')).toBeNull();
    });
  });

  it('uses gsap when present', () => {
    const calls = stubGsap();
    loadScript(SCRIPT, window);
    expect(calls).toHaveLength(2);
    expect(calls[0].target).toBe(items()[0]);
    expect(calls[0].from).toEqual({ y: 60, opacity: 0 });
    expect(calls[0].to).toMatchObject({ y: 0, opacity: 1, duration: 1, ease: 'power4.out' });
    expect(calls[0].to.scrollTrigger).toMatchObject({ trigger: items()[0], start: 'top bottom', once: true });
  });

  it('staggers the elements of one row by 0.1 s', () => {
    const calls = stubGsap();
    loadScript(SCRIPT, window);
    expect(calls.map((call) => call.to.delay)).toEqual([0.1, 0.2]);
  });

  it('leaves an element already on screen alone', () => {
    const calls = stubGsap();
    belowTheFold(items()[0], 100);
    loadScript(SCRIPT, window);
    expect(calls.map((call) => call.target)).toEqual([items()[1]]);
  });

  it('skips the motion with reduced motion', () => {
    const calls = stubGsap();
    window.matchMedia = (query) => ({ matches: query.includes('reduce'), media: query, addEventListener() {}, removeEventListener() {} });
    loadScript(SCRIPT, window);
    expect(calls).toHaveLength(0);
  });

  it('init twice tweens once', () => {
    const calls = stubGsap();
    loadScript(SCRIPT, window);
    window.DS.reveal.init();
    window.DS.reveal.init(document);
    expect(calls).toHaveLength(2);
  });
});
