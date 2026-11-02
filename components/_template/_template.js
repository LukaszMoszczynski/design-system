// Component JS convention: a classic script (no import/export) that registers window.DS.<camelName>,
// auto-inits on DOMContentLoaded and is idempotent through data-ds-ready, so calling init() again
// (Swup page change, Storybook re-render, block editor) never attaches a second handler.
(function () {
  window.DS = window.DS || {};

  function init(root = document) {
    root.querySelectorAll('[data-ds-example]:not([data-ds-ready])').forEach((element) => {
      element.dataset.dsReady = 'true';
      element.addEventListener('click', () => {
        element.setAttribute('aria-pressed', element.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      });
    });
  }

  window.DS.example = { init };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();
})();
