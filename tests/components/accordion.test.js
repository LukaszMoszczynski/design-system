// Accordion: native <details>, so opening and closing work without JS. The script only keeps one item open per list
// when the list has data-ds-single.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Window } from 'happy-dom';
import { loadScript } from '../helpers/load-script.js';
import { renderAccordion } from '../../components/molecules/accordion/accordion.template.js';

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
