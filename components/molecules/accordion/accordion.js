// Accordion: the items are native <details>, so they open and close without this script. It only enforces one open
// item per list where the list has data-ds-single: when an item opens, the other open items of that list close.
// Classic script, idempotent through data-ds-ready (see components/README.md, JS convention).
(function () {
  window.DS = window.DS || {};

  function closeOthers(list, openedItem) {
    list.querySelectorAll('.ds-accordion__item[open]').forEach((item) => {
      if (item !== openedItem && item.closest('[data-ds-accordion]') === list) item.open = false;
    });
  }

  function init(root = document) {
    root.querySelectorAll('[data-ds-accordion][data-ds-single]:not([data-ds-ready])').forEach((list) => {
      list.dataset.dsReady = 'true';
      // "toggle" does not bubble, so the list listens in the capture phase.
      list.addEventListener(
        'toggle',
        (event) => {
          const item = event.target;
          if (item.matches?.('.ds-accordion__item') && item.open) closeOthers(list, item);
        },
        true,
      );
    });
  }

  window.DS.accordion = { init };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();
})();
