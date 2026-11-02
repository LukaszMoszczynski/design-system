// Header: header.js adds is-scrolled once the page scrolls and opens / closes the Mega menu from the caret toggle.
// Motion (with window.gsap): the panel fades and drops in, the scrolled shadow tweens; without GSAP it switches at once.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Window } from 'happy-dom';
import { loadScript } from '../helpers/load-script.js';
import { renderHeader } from '../../components/organisms/header/header.template.js';

const SCRIPT = 'components/organisms/header/header.js';

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

describe('header script', () => {
  let window;
  let document;
  const header = () => document.querySelector('[data-ds-header]');
  const toggle = () => document.querySelector('[data-ds-mega-toggle]');
  const mega = () => document.querySelector('[data-ds-mega]');
  const scrollTo = (y) => {
    Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
    window.dispatchEvent(new window.Event('scroll'));
  };
  const escape = () => document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));

  beforeEach(() => {
    window = new Window({ width: 1440, height: 900 });
    document = window.document;
    document.body.innerHTML = renderHeader();
  });

  it('adds is-scrolled after scrollY > 0', () => {
    loadScript(SCRIPT, window);
    expect(header().classList.contains('is-scrolled')).toBe(false);
    scrollTo(1);
    expect(header().classList.contains('is-scrolled')).toBe(true);
    scrollTo(0);
    expect(header().classList.contains('is-scrolled')).toBe(false);
  });

  it('toggle opens the mega menu and sets aria-expanded', () => {
    loadScript(SCRIPT, window);
    expect(mega().hidden).toBe(true);
    toggle().click();
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    expect(mega().hidden).toBe(false);
    toggle().click();
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    expect(mega().hidden).toBe(true);
  });

  it('Escape closes and returns focus', () => {
    loadScript(SCRIPT, window);
    toggle().click();
    mega().querySelector('a').focus();
    escape();
    expect(mega().hidden).toBe(true);
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(toggle());
  });

  it('Escape leaves an open dialog above the menu to the dialog', () => {
    loadScript(SCRIPT, window);
    toggle().click();
    document.body.insertAdjacentHTML('beforeend', '<dialog open>Koszyk</dialog>');
    escape();
    expect(mega().hidden).toBe(false);
  });

  it('a click outside the header closes the mega menu', () => {
    loadScript(SCRIPT, window);
    document.body.insertAdjacentHTML('beforeend', '<p id="outside">Treść</p>');
    toggle().click();
    document.getElementById('outside').click();
    expect(mega().hidden).toBe(true);
  });

  it('init twice', () => {
    loadScript(SCRIPT, window);
    const attach = vi.spyOn(toggle(), 'addEventListener');
    window.DS.header.init();
    window.DS.header.init(document);
    expect(attach).not.toHaveBeenCalled();
    toggle().click();
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
  });

  it('works without gsap', () => {
    loadScript(SCRIPT, window);
    toggle().click();
    expect(mega().hidden).toBe(false);
    expect(mega().getAttribute('style')).toBeNull();
    scrollTo(10);
    expect(header().classList.contains('is-scrolled')).toBe(true);
  });

  it('uses gsap when present', () => {
    const calls = stubGsap(window);
    loadScript(SCRIPT, window);
    toggle().click();
    const open = calls.find((call) => call.target === mega());
    expect(open.method).toBe('fromTo');
    expect(open.to).toMatchObject({ opacity: 1, y: 0, duration: 0.3, ease: 'power1.out' });
    toggle().click();
    expect(calls.filter((call) => call.target === mega()).map((call) => call.method)).toEqual(['fromTo', 'to']);
    expect(mega().hidden).toBe(true);
    scrollTo(10);
    const shadow = calls.find((call) => call.target === document.querySelector('.ds-header__bar'));
    expect(shadow.to).toMatchObject({ duration: 0.2 });
  });

  it('skips the motion with reduced motion', () => {
    const calls = stubGsap(window);
    window.matchMedia = (query) => ({ matches: query.includes('reduce'), media: query, addEventListener() {}, removeEventListener() {} });
    loadScript(SCRIPT, window);
    toggle().click();
    scrollTo(10);
    expect(calls).toHaveLength(0);
    expect(mega().hidden).toBe(false);
  });
});
