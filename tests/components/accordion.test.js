// Accordion: native <details>, so opening and closing work without JS. The script only keeps one item open per list
// when the list has data-ds-single.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Window } from 'happy-dom';
import { loadScript } from '../helpers/load-script.js';
import { renderAccordion } from '../../components/molecules/accordion/accordion.template.js';
import { renderAccordionChallengeList } from '../../components/molecules/accordion-challenge/accordion-challenge.template.js';

const SCRIPT = 'components/molecules/accordion/accordion.js';
const ITEMS = [
  { question: 'Pierwsze?', answer: 'Tak.' },
  { question: 'Drugie?', answer: 'Też.' },
  { question: 'Trzecie?', answer: 'Również.' },
];

// The browser fires "toggle" after the open attribute changes; happy-dom may not, so the test fires it itself.
function openItem(window, item) {
  item.open = true;
  item.dispatchEvent(new window.Event('toggle'));
}

describe('accordion script', () => {
  let window;
  let document;
  const items = () => [...document.querySelectorAll('.ds-accordion__item')];

  beforeEach(() => {
    window = new Window();
    document = window.document;
  });

  it('registers window.DS.accordion and marks single lists ready', () => {
    document.body.innerHTML = renderAccordion({ items: ITEMS, single: true });
    loadScript(SCRIPT, window);
    expect(typeof window.DS.accordion.init).toBe('function');
    expect(document.querySelector('[data-ds-accordion]').dataset.dsReady).toBe('true');
  });

  it('opening one closes the other with data-ds-single', () => {
    document.body.innerHTML = renderAccordion({ items: ITEMS, single: true });
    loadScript(SCRIPT, window);
    openItem(window, items()[0]);
    openItem(window, items()[1]);
    expect(items().map((item) => item.open)).toEqual([false, true, false]);
  });

  it('leaves the others open without data-ds-single', () => {
    document.body.innerHTML = renderAccordion({ items: ITEMS });
    loadScript(SCRIPT, window);
    openItem(window, items()[0]);
    openItem(window, items()[1]);
    expect(items().map((item) => item.open)).toEqual([true, true, false]);
  });

  it('only closes items of its own list', () => {
    document.body.innerHTML = renderAccordion({ items: ITEMS, single: true }) + renderAccordion({ items: ITEMS, single: true });
    loadScript(SCRIPT, window);
    openItem(window, items()[0]);
    openItem(window, items()[4]);
    expect(items().map((item) => item.open)).toEqual([true, false, false, false, true, false]);
  });

  it('init twice attaches one handler', () => {
    document.body.innerHTML = renderAccordion({ items: ITEMS, single: true });
    loadScript(SCRIPT, window);
    const list = document.querySelector('[data-ds-accordion]');
    const attach = vi.spyOn(list, 'addEventListener');
    window.DS.accordion.init();
    window.DS.accordion.init(document);
    expect(attach).not.toHaveBeenCalled();
    openItem(window, items()[0]);
    openItem(window, items()[2]);
    expect(items().map((item) => item.open)).toEqual([false, false, true]);
  });

  it('init picks up a list added later', () => {
    loadScript(SCRIPT, window);
    document.body.innerHTML = renderAccordion({ items: ITEMS, single: true });
    window.DS.accordion.init(document.body);
    openItem(window, items()[0]);
    openItem(window, items()[1]);
    expect(items().map((item) => item.open)).toEqual([false, true, false]);
  });
});

describe('accordion template', () => {
  it('starts with every item closed and escapes text', () => {
    const markup = renderAccordion({ items: [{ question: '<b>"Q"</b>', answer: 'A & B' }] });
    expect(markup).not.toContain(' open');
    expect(markup).toContain('&lt;b&gt;&quot;Q&quot;&lt;/b&gt;');
    expect(markup).toContain('A &amp; B');
  });
});

// Motion: with window.gsap the script animates the height on open and close; without it (or with reduced motion)
// the click is left to the browser, so <details> opens natively.
describe('accordion motion', () => {
  let window;
  let document;
  const items = () => [...document.querySelectorAll('details')];
  const summary = (index) => items()[index].querySelector('summary');
  const click = (element) => {
    const event = new window.MouseEvent('click', { bubbles: true, cancelable: true });
    element.dispatchEvent(event);
    return event;
  };

  // A gsap stub that finishes every tween at once and records it.
  function stubGsap() {
    const calls = [];
    window.gsap = {
      fromTo(target, from, to) {
        calls.push({ target, from, to });
        to.onComplete?.();
        return { kill() {} };
      },
      killTweensOf() {},
      set() {},
    };
    return calls;
  }

  beforeEach(() => {
    window = new Window();
    document = window.document;
  });

  it('works without gsap', () => {
    document.body.innerHTML = renderAccordion({ items: ITEMS, single: true });
    loadScript(SCRIPT, window);
    const event = click(summary(0));
    expect(event.defaultPrevented).toBe(false);
    openItem(window, items()[0]);
    openItem(window, items()[1]);
    expect(items().map((item) => item.open)).toEqual([false, true, false]);
  });

  it('uses gsap when present', () => {
    const calls = stubGsap();
    document.body.innerHTML = renderAccordion({ items: ITEMS });
    loadScript(SCRIPT, window);
    const event = click(summary(0));
    expect(event.defaultPrevented).toBe(true);
    expect(items()[0].open).toBe(true);
    expect(calls).toHaveLength(1);
    expect(calls[0].target).toBe(items()[0]);
    expect(calls[0].to).toMatchObject({ duration: 0.3, ease: 'power1.out' });
    click(summary(0));
    expect(calls).toHaveLength(2);
    expect(items()[0].open).toBe(false);
    expect(items()[0].classList.contains('is-closing')).toBe(false);
  });

  it('with gsap, opening one closes the other with data-ds-single (animated)', () => {
    const calls = stubGsap();
    document.body.innerHTML = renderAccordion({ items: ITEMS, single: true });
    loadScript(SCRIPT, window);
    click(summary(0));
    click(summary(1));
    expect(items().map((item) => item.open)).toEqual([false, true, false]);
    expect(calls).toHaveLength(3);
  });

  it('with gsap, a challenge list keeps one open through its name, animated', () => {
    const calls = stubGsap();
    document.body.innerHTML = renderAccordionChallengeList();
    loadScript(SCRIPT, window);
    expect(items()[0].hasAttribute('name')).toBe(false);
    click(summary(0));
    click(summary(1));
    expect(items().map((item) => item.open)).toEqual([false, true, false]);
    expect(calls).toHaveLength(3);
  });

  it('skips the animation with reduced motion', () => {
    const calls = stubGsap();
    window.matchMedia = (query) => ({ matches: query.includes('reduce'), media: query, addEventListener() {}, removeEventListener() {} });
    document.body.innerHTML = renderAccordion({ items: ITEMS });
    loadScript(SCRIPT, window);
    const event = click(summary(0));
    expect(event.defaultPrevented).toBe(false);
    expect(calls).toHaveLength(0);
  });

  it('init twice attaches one click handler', () => {
    const calls = stubGsap();
    document.body.innerHTML = renderAccordion({ items: ITEMS });
    loadScript(SCRIPT, window);
    window.DS.accordion.init();
    window.DS.accordion.init(document);
    click(summary(0));
    expect(calls).toHaveLength(1);
    expect(items()[0].open).toBe(true);
  });
});
