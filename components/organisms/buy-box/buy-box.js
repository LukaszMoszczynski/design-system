// Buy box: for every form[data-ds-buy-box] (buy-box.template.js). DCC: blocks/produkt/view.js.
// - The brutto / netto switch ([data-ds-price-mode] buttons, aria-pressed) shows the price, the note under it and the
//   total in that mode (data-ds-gross / data-ds-net on the form, the unit prices in złoty).
// - The Quantity stepper's minus and plus step the quantity; a typed quantity is put back within 1…max (the seats).
//   The total („Razem”) is unit × quantity in the shown mode.
// Without the script the form posts as it is (quantity 1 unless typed) and shows the brutto price. No motion.
// Classic script, idempotent through data-ds-ready (see components/README.md, JS convention).
(function () {
  window.DS = window.DS || {};

  const NBSP = ' ';

  // „1 490 zł”, „805,69 zł”: the same as formatPrice() in buy-box.template.js (the site's DCC.money).
  function formatPrice(amount) {
    const value = Math.round(Number(amount) * 100) / 100;
    const [whole, cents] = value.toFixed(Number.isInteger(value) ? 0 : 2).split('.');
    return `${whole.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP)}${cents ? `,${cents}` : ''}${NBSP}zł`;
  }

  function initBuyBox(form) {
    form.dataset.dsReady = 'true';
    const find = (selector) => form.querySelector(selector);
    const amount = find('[data-ds-buy-amount]');
    const note = find('[data-ds-buy-note]');
    const total = find('[data-ds-buy-total]');
    const quantity = find('[data-ds-quantity] input');
    const modes = [...form.querySelectorAll('[data-ds-price-mode]')];
    const prices = { brutto: Number(form.dataset.dsGross) || 0, netto: Number(form.dataset.dsNet) || 0 };
    let mode = 'brutto';

    const count = () => (quantity ? Number(quantity.value) || 1 : 1);
    function clamp(value) {
      const max = Number(quantity.max) || Infinity;
      quantity.value = String(Math.min(Math.max(Math.floor(Number(value)) || 1, Number(quantity.min) || 1), max));
    }

    function render() {
      const other = mode === 'netto' ? 'brutto' : 'netto';
      if (amount) amount.textContent = formatPrice(prices[mode]);
      if (note) note.textContent = `${mode} · ${formatPrice(prices[other])} ${other}`;
      if (total) total.textContent = `Razem: ${formatPrice(prices[mode] * count())}`;
      modes.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.dsPriceMode === mode)));
    }

    form.addEventListener('click', (event) => {
      const modeButton = event.target.closest?.('[data-ds-price-mode]');
      if (modeButton) {
        mode = modeButton.dataset.dsPriceMode === 'netto' ? 'netto' : 'brutto';
        render();
        return;
      }
      if (!quantity) return;
      if (event.target.closest?.('[data-ds-quantity-minus]')) clamp(count() - 1);
      else if (event.target.closest?.('[data-ds-quantity-plus]')) clamp(count() + 1);
      else return;
      render();
    });
    form.addEventListener('change', (event) => {
      if (event.target !== quantity) return;
      clamp(quantity.value);
      render();
    });
    render();
  }

  function init(root = document) {
    root.querySelectorAll('form[data-ds-buy-box]:not([data-ds-ready])').forEach(initBuyBox);
  }

  window.DS.buyBox = { init };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();
})();
