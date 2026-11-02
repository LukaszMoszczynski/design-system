// Buy box: buy-box.js switches the shown price between brutto and netto and keeps the quantity and the total in step.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Window } from 'happy-dom';
import { loadScript } from '../helpers/load-script.js';
import { formatPrice, renderBuyBox } from '../../components/organisms/buy-box/buy-box.template.js';

const SCRIPT = 'components/organisms/buy-box/buy-box.js';
const NBSP = ' ';

describe('buy box script', () => {
  let window;
  let document;
  const find = (selector) => document.querySelector(selector);
  const amount = () => find('[data-ds-buy-amount]').textContent;
  const note = () => find('[data-ds-buy-note]').textContent;
  const total = () => find('[data-ds-buy-total]').textContent;
  const quantity = () => find('.ds-quantity__input');
  const mode = (name) => find(`[data-ds-price-mode="${name}"]`);

  beforeEach(() => {
    window = new Window();
    document = window.document;
    document.body.innerHTML = renderBuyBox({ gross: 1490, net: 1211.38, seats: 3 });
    loadScript(SCRIPT, window);
  });

  it('brutto/netto toggle switches the shown price', () => {
    expect(amount()).toBe(`1${NBSP}490${NBSP}zł`);
    mode('netto').click();
    expect(amount()).toBe(`1${NBSP}211,38${NBSP}zł`);
    expect(note()).toBe(`netto · 1${NBSP}490${NBSP}zł brutto`);
    expect(mode('netto').getAttribute('aria-pressed')).toBe('true');
    expect(mode('brutto').getAttribute('aria-pressed')).toBe('false');
    mode('brutto').click();
    expect(amount()).toBe(`1${NBSP}490${NBSP}zł`);
    expect(note()).toBe(`brutto · 1${NBSP}211,38${NBSP}zł netto`);
  });

  it('stepper total = unit × quantity, min 1', () => {
    find('[data-ds-quantity-plus]').click();
    expect(quantity().value).toBe('2');
    expect(total()).toBe(`Razem: 2${NBSP}980${NBSP}zł`);
    mode('netto').click();
    expect(total()).toBe(`Razem: 2${NBSP}422,76${NBSP}zł`);
    find('[data-ds-quantity-minus]').click();
    find('[data-ds-quantity-minus]').click();
    expect(quantity().value).toBe('1');
    expect(total()).toBe(`Razem: 1${NBSP}211,38${NBSP}zł`);
  });

  it('a typed quantity stays within 1…seats', () => {
    quantity().value = '0';
    quantity().dispatchEvent(new window.Event('change', { bubbles: true }));
    expect(quantity().value).toBe('1');
    quantity().value = '9';
    quantity().dispatchEvent(new window.Event('change', { bubbles: true }));
    expect(quantity().value).toBe('3');
    expect(total()).toBe(`Razem: 4${NBSP}470${NBSP}zł`);
    find('[data-ds-quantity-plus]').click();
    expect(quantity().value).toBe('3');
  });

  it('init twice', () => {
    const form = find('[data-ds-buy-box]');
    const attach = vi.spyOn(form, 'addEventListener');
    window.DS.buyBox.init();
    window.DS.buyBox.init(document);
    expect(attach).not.toHaveBeenCalled();
    find('[data-ds-quantity-plus]').click();
    expect(quantity().value).toBe('2');
  });
});

describe('buy box template', () => {
  it('formats prices the Polish way with no-break spaces', () => {
    expect(formatPrice(1490)).toBe(`1${NBSP}490${NBSP}zł`);
    expect(formatPrice(805.69)).toBe(`805,69${NBSP}zł`);
    expect(formatPrice(12000.5)).toBe(`12${NBSP}000,50${NBSP}zł`);
  });

  it('renders the price, the term select, the stepper, the facts and a submit button; text is escaped', () => {
    const markup = renderBuyBox({ facts: [{ label: '<b>"Kiedy"</b>', value: 'A & B' }] });
    expect(markup).toContain('data-ds-buy-box');
    expect(markup).toContain('ds-field--select');
    expect(markup).toContain('data-ds-quantity');
    expect(markup).toContain('<button type="submit" class="ds-button ds-button--accent"');
    expect(markup).toContain('&lt;b&gt;&quot;Kiedy&quot;&lt;/b&gt;');
    expect(markup).toContain('A &amp; B');
  });
});
