// Mobile menu: mobile-menu.js opens the drawer from the header's burger, locks the page scroll (without a scrollbar jump)
// and closes on Escape, on a tapped link and on the burger. Motion (with window.gsap): the drawer slides in from the right.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Window } from 'happy-dom';
import { loadScript } from '../helpers/load-script.js';
import { renderHeader } from '../../components/organisms/header/header.template.js';

const HEADER = 'components/organisms/header/header.js';
const SCRIPT = 'components/organisms/mobile-menu/mobile-menu.js';

function stubGsap(window) {
  const calls = [];
  window.gsap = {
    fromTo(target, from, to) {
      calls.push({ method: 'fromTo', target, from, to });
      to.onComplete?.();
      return { kill() {} };
    },
    to(target, to) {
      calls.push({ method: 'to', target, to });
      to.onComplete?.();
      return { kill() {} };
    },
    killTweensOf() {},
    set() {},
  };
  return calls;
}

describe('mobile menu script', () => {
  let window;
  let document;
  const burger = () => document.querySelector('.ds-nav-burger');
  const drawer = () => document.querySelector('[data-ds-mobile-menu]');
  const toggle = () => document.querySelector('[data-ds-mega-toggle]');
  const mega = () => document.querySelector('[data-ds-mega]');
  const html = () => document.documentElement;
  const escape = () => document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));

  beforeEach(() => {
    window = new Window({ width: 390, height: 844 });
    document = window.document;
    document.body.innerHTML = `${renderHeader()}<main id="page">Treść</main>`;
  });

  it('the burger opens and closes the drawer', () => {
    loadScript(SCRIPT, window);
    expect(drawer().hidden).toBe(true);
    burger().click();
    expect(drawer().hidden).toBe(false);
    expect(burger().getAttribute('aria-expanded')).toBe('true');
    burger().click();
    expect(drawer().hidden).toBe(true);
    expect(burger().getAttribute('aria-expanded')).toBe('false');
  });

  it('Escape closes the drawer only', () => {
    loadScript(HEADER, window);
    loadScript(SCRIPT, window);
    toggle().click(); // the mega menu open underneath (a desktop window narrowed with it open)
    burger().click();
    escape();
    expect(drawer().hidden).toBe(true);
    expect(document.activeElement).toBe(burger());
    expect(mega().hidden).toBe(false);
    escape();
    expect(mega().hidden).toBe(true);
  });

  it('Escape leaves an open dialog above the drawer to the dialog', () => {
    loadScript(SCRIPT, window);
    burger().click();
    document.body.insertAdjacentHTML('beforeend', '<dialog open>Koszyk</dialog>');
    escape();
    expect(drawer().hidden).toBe(false);
  });

  it('opening locks body scroll without a scrollbar jump', () => {
    Object.defineProperty(html(), 'clientWidth', { value: 375, configurable: true });
    html().style.paddingRight = '4px';
    loadScript(SCRIPT, window);
    burger().click();
    expect(html().style.overflow).toBe('hidden');
    // The 15 px scrollbar is replaced by padding, on top of the page's own.
    expect(html().style.paddingRight).toBe('19px');
    burger().click();
    expect(html().style.overflow).toBe('');
    expect(html().style.paddingRight).toBe('4px');
  });

  it('while open the page outside the header is inert', () => {
    loadScript(SCRIPT, window);
    burger().click();
    expect(document.getElementById('page').inert).toBe(true);
    burger().click();
    expect(document.getElementById('page').inert).toBe(false);
  });

  it('a tapped link closes the drawer', () => {
    loadScript(SCRIPT, window);
    burger().click();
    drawer().querySelector('a.ds-mobile-menu__link').click();
    expect(drawer().hidden).toBe(true);
  });

  it('init twice', () => {
    loadScript(SCRIPT, window);
    const attach = vi.spyOn(burger(), 'addEventListener');
    window.DS.mobileMenu.init();
    window.DS.mobileMenu.init(document);
    expect(attach).not.toHaveBeenCalled();
    burger().click();
    expect(drawer().hidden).toBe(false);
  });

  it('works without gsap', () => {
    loadScript(SCRIPT, window);
    burger().click();
    expect(drawer().hidden).toBe(false);
    expect(drawer().getAttribute('style')).toBeNull();
  });

  it('uses gsap when present', () => {
    const calls = stubGsap(window);
    loadScript(SCRIPT, window);
    burger().click();
    expect(calls[0]).toMatchObject({ method: 'fromTo', target: drawer(), from: { xPercent: 100 } });
    expect(calls[0].to).toMatchObject({ xPercent: 0, duration: 0.3, ease: 'power1.out' });
    burger().click();
    expect(calls[1]).toMatchObject({ method: 'to', target: drawer() });
    expect(drawer().hidden).toBe(true);
  });

  it('skips the motion with reduced motion', () => {
    const calls = stubGsap(window);
    window.matchMedia = (query) => ({ matches: query.includes('reduce'), media: query, addEventListener() {}, removeEventListener() {} });
    loadScript(SCRIPT, window);
    burger().click();
    expect(calls).toHaveLength(0);
    expect(drawer().hidden).toBe(false);
  });
});
