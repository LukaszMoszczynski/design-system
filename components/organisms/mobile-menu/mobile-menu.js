// Mobile menu: the phone drawer, for every [data-ds-mobile-menu] (mobile-menu.template.js) and the burger that controls
// it (.ds-nav-burger[aria-controls], in the header bar). DCC: blocks/naglowek/view.js.
// - The burger opens and closes the drawer (aria-expanded, hidden). While it is open:
//   - the page cannot scroll: html gets overflow hidden, and padding where the scrollbar was, so nothing jumps sideways;
//   - everything outside the header is inert, so Tab stays in the menu;
//   - Escape closes the drawer only (focus back on the burger). It runs in the capture phase and marks the key handled
//     (preventDefault), so the header's Mega menu, open underneath, stays as it is until the next Escape. An open
//     <dialog> above (the cart) takes the key itself.
// - A tapped link closes it (also the current page's), and so does widening the window to the desktop layout.
// - With window.gsap the drawer slides in from the right and out again (0.3 s, power1.out). Without GSAP, or with
//   prefers-reduced-motion: reduce, it shows and hides at once. The Oferta row is a .ds-details: accordion.js animates it.
// Classic script, idempotent through data-ds-ready (see components/README.md, JS convention).
(function () {
  window.DS = window.DS || {};

  const DURATION = 0.3;
  const EASE = 'power1.out';

  function animated() {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    return Boolean(window.gsap) && !reduced;
  }

  // Page scroll lock without a scrollbar jump: the scrollbar's width becomes padding on <html>.
  let lockedStyle = null;
  function lockScroll() {
    if (lockedStyle) return;
    const root = document.documentElement;
    const scrollbar = window.innerWidth - root.clientWidth;
    lockedStyle = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
    if (scrollbar > 0) root.style.paddingRight = `${(parseFloat(window.getComputedStyle(root).paddingRight) || 0) + scrollbar}px`;
    root.style.overflow = 'hidden';
  }
  function unlockScroll() {
    if (!lockedStyle) return;
    const root = document.documentElement;
    root.style.overflow = lockedStyle.overflow;
    root.style.paddingRight = lockedStyle.paddingRight;
    lockedStyle = null;
  }

  function initDrawer(drawer) {
    drawer.dataset.dsReady = 'true';
    // The burger in the same header (the drawer may not be in the document yet).
    const scope = drawer.closest('[data-ds-header]') ?? drawer.parentElement ?? drawer;
    const burger = [...scope.querySelectorAll('.ds-nav-burger[aria-controls]')].find((button) => button.getAttribute('aria-controls') === drawer.id);
    if (!burger) return;
    burger.dataset.dsReady = 'true';
    const isOpen = () => burger.getAttribute('aria-expanded') === 'true';

    // Everything outside the header (or the drawer) is inert while the drawer is open.
    let inerted = [];
    function holdFocus(on) {
      inerted.forEach((node) => {
        node.inert = false;
      });
      inerted = [];
      if (!on) return;
      for (let node = scope; node?.parentElement && node !== document.body; node = node.parentElement) {
        for (const sibling of node.parentElement.children) {
          if (sibling !== node && !sibling.inert && !/^(SCRIPT|STYLE|LINK)$/.test(sibling.tagName)) {
            sibling.inert = true;
            inerted.push(sibling);
          }
        }
      }
    }

    function setOpen(open) {
      if (open === isOpen()) return;
      burger.setAttribute('aria-expanded', String(open));
      holdFocus(open);
      if (open) lockScroll();
      else unlockScroll();
      if (!animated()) {
        drawer.hidden = !open;
        return;
      }
      window.gsap.killTweensOf?.(drawer);
      if (open) {
        drawer.hidden = false;
        window.gsap.fromTo(drawer, { xPercent: 100 }, { xPercent: 0, duration: DURATION, ease: EASE, clearProps: 'transform' });
      } else {
        window.gsap.to(drawer, {
          xPercent: 100,
          duration: DURATION,
          ease: EASE,
          onComplete: () => {
            if (isOpen()) return; // reopened meanwhile
            drawer.hidden = true;
            window.gsap.set?.(drawer, { clearProps: 'transform' });
          },
        });
      }
    }

    burger.addEventListener('click', () => setOpen(!isOpen()));
    drawer.addEventListener('click', (event) => {
      if (event.target.closest?.('a')) setOpen(false);
    });
    document.addEventListener(
      'keydown',
      (event) => {
        if (event.key !== 'Escape' || event.defaultPrevented || !isOpen()) return;
        if (document.querySelector('dialog[open]')) return; // the dialog above takes this Escape
        event.preventDefault();
        setOpen(false);
        burger.focus();
      },
      true,
    );
    // Widening the window past the phone layout while the drawer is open: close it, or the page stays locked.
    window.matchMedia?.('(min-width: 1025px)').addEventListener?.('change', (event) => {
      if (event.matches) setOpen(false);
    });
  }

  function init(root = document) {
    root.querySelectorAll('[data-ds-mobile-menu]:not([data-ds-ready])').forEach(initDrawer);
  }

  window.DS.mobileMenu = { init };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();
})();
