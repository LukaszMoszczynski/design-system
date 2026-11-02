// Header: is-scrolled and the Mega menu, for every [data-ds-header] (header.template.js). DCC: blocks/naglowek/view.js.
// - is-scrolled as soon as the page is scrolled (scrollY > 0): the bar gets its shadow. With window.gsap the shadow
//   tweens in and out (0.2 s, the site's CSS transition); the class toggles only when the state changes.
// - The caret toggle [data-ds-mega-toggle] opens and closes the panel it controls (aria-controls, aria-expanded, hidden).
//   With a mouse on a desktop window the panel also opens on hover of the item and closes 0.2 s after the pointer
//   leaves; a click right after the hover opened it keeps it open. It closes on Escape (focus back on the toggle), on a
//   click outside the header and when focus moves on past the header.
// - With window.gsap the panel fades in and drops 8 px into place (0.3 s, power1.out: the site's 300 ms ease-out) and
//   fades out on close. Without GSAP, or with prefers-reduced-motion: reduce, it switches at once.
// - Escape: a key another layer already handled (the Mobile menu's drawer, defaultPrevented) or an open <dialog> above
//   (the cart) is left alone.
// Classic script, idempotent through data-ds-ready (see components/README.md, JS convention).
(function () {
  window.DS = window.DS || {};

  const DURATION = 0.3;
  const SHADOW_DURATION = 0.2;
  const EASE = 'power1.out';
  const HOVER_CLOSE_DELAY = 200;

  function animated() {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    return Boolean(window.gsap) && !reduced;
  }

  function initHeader(header) {
    header.dataset.dsReady = 'true';
    const bar = header.querySelector('.ds-header__bar');
    const toggle = header.querySelector('[data-ds-mega-toggle]');
    // The panel the toggle controls, looked up inside the header (it may not be in the document yet).
    const mega = toggle ? [...header.querySelectorAll('[data-ds-mega]')].find((panel) => panel.id === toggle.getAttribute('aria-controls')) : null;

    // Scrolled: toggle only on a change, so scrolling does not restyle on every event.
    let scrolled = header.classList.contains('is-scrolled');
    function onScroll() {
      const now = window.scrollY > 0;
      if (now === scrolled) return;
      scrolled = now;
      const before = bar && animated() ? window.getComputedStyle(bar).boxShadow : null;
      header.classList.toggle('is-scrolled', now);
      if (before === null) return;
      const after = window.getComputedStyle(bar).boxShadow;
      window.gsap.killTweensOf?.(bar);
      window.gsap.fromTo(bar, { boxShadow: before }, { boxShadow: after, duration: SHADOW_DURATION, ease: EASE, clearProps: 'boxShadow' });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    // A page opened scrolled (reload half-way down) starts scrolled; markup rendered with is-scrolled keeps it until the
    // first scroll (the Scrolled story).
    if (!scrolled) onScroll();

    if (!toggle || !mega) return;
    const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
    let hoverOpened = false;
    let closeTimer = null;
    const hoverable = window.matchMedia?.('(hover: hover) and (min-width: 1025px)');

    function setOpen(open) {
      if (open === isOpen()) return;
      toggle.setAttribute('aria-expanded', String(open));
      if (!animated()) {
        mega.hidden = !open;
        return;
      }
      window.gsap.killTweensOf?.(mega);
      if (open) {
        mega.hidden = false;
        window.gsap.fromTo(mega, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: DURATION, ease: EASE, clearProps: 'opacity,transform' });
      } else {
        window.gsap.to(mega, {
          opacity: 0,
          y: -8,
          duration: SHADOW_DURATION,
          ease: EASE,
          onComplete: () => {
            if (isOpen()) return; // reopened meanwhile
            mega.hidden = true;
            window.gsap.set?.(mega, { clearProps: 'opacity,transform' });
          },
        });
      }
    }

    toggle.addEventListener('click', () => {
      // A click right after the hover opened the panel pins it open instead of closing it.
      if (hoverOpened) {
        hoverOpened = false;
        return;
      }
      setOpen(!isOpen());
    });

    const item = toggle.closest('.ds-header__item');
    function onEnter() {
      if (!hoverable?.matches) return;
      clearTimeout(closeTimer);
      if (!isOpen()) {
        hoverOpened = true;
        setOpen(true);
      }
    }
    function onLeave() {
      if (!hoverable?.matches || !hoverOpened) return;
      closeTimer = setTimeout(() => {
        hoverOpened = false;
        setOpen(false);
      }, HOVER_CLOSE_DELAY);
    }
    [item, mega].forEach((element) => {
      element?.addEventListener('mouseenter', onEnter);
      element?.addEventListener('mouseleave', onLeave);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || event.defaultPrevented || !isOpen()) return;
      if (document.querySelector('dialog[open]')) return; // the dialog above takes this Escape
      event.preventDefault();
      hoverOpened = false;
      setOpen(false);
      toggle.focus();
    });
    document.addEventListener('click', (event) => {
      if (isOpen() && !header.contains(event.target)) {
        hoverOpened = false;
        setOpen(false);
      }
    });
    header.addEventListener('focusout', (event) => {
      if (isOpen() && event.relatedTarget && !header.contains(event.relatedTarget)) {
        hoverOpened = false;
        setOpen(false);
      }
    });
  }

  function init(root = document) {
    root.querySelectorAll('[data-ds-header]:not([data-ds-ready])').forEach(initHeader);
  }

  window.DS.header = { init };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();
})();
