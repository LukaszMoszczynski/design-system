// Accordion motion and one-open lists, for Accordion (.ds-accordion__item) and Accordion/Challenge (.ds-accordion-challenge).
// The items are native <details>: without this script, without window.gsap or with reduced motion they open and close
// as the browser does (and a shared `name` keeps one open). The script adds:
// - data-ds-single on an Accordion list: when an item opens, the other open items of that list close;
// - with window.gsap: the height animates on open and close (0.3 s, power1.out: the site's 300 ms ease-out). While an
//   item closes it carries is-closing, so its icon and colours change with the height. A `name` group moves to
//   data-ds-group, because the browser would close the previous item at once; the script closes it animated.
// Classic script, idempotent through data-ds-ready (see components/README.md, JS convention).
(function () {
  window.DS = window.DS || {};

  const ITEM = '.ds-accordion__item, .ds-accordion-challenge';
  const DURATION = 0.3;
  const EASE = 'power1.out';

  function animated() {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    return Boolean(window.gsap) && !reduced;
  }

  // The other items that close when `item` opens: its data-ds-single list, or its name group.
  function siblings(item) {
    const list = item.closest('[data-ds-accordion][data-ds-single]');
    const group = item.dataset.dsGroup;
    let others = [];
    if (list) others = [...list.querySelectorAll(ITEM)].filter((other) => other.closest('[data-ds-accordion]') === list);
    else if (group) others = [...document.querySelectorAll(ITEM)].filter((other) => other.dataset.dsGroup === group);
    return others.filter((other) => other !== item && other.open);
  }

  function closedHeight(item) {
    const style = window.getComputedStyle(item);
    const summary = item.querySelector('summary');
    const frame = ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth'].reduce((sum, key) => sum + (parseFloat(style[key]) || 0), 0);
    return (summary?.offsetHeight ?? 0) + frame;
  }

  function tween(item, from, to, onComplete) {
    window.gsap.killTweensOf?.(item);
    item.style.overflow = 'hidden';
    window.gsap.fromTo(
      item,
      { height: from },
      {
        height: to,
        duration: DURATION,
        ease: EASE,
        onComplete: () => {
          onComplete?.();
          item.style.height = '';
          item.style.overflow = '';
        },
      },
    );
  }

  function close(item) {
    if (!item.open || item.classList.contains('is-closing')) return;
    item.classList.add('is-closing');
    tween(item, item.offsetHeight, closedHeight(item), () => {
      item.classList.remove('is-closing');
      item.open = false;
    });
  }

  function open(item) {
    siblings(item).forEach(close);
    const start = item.offsetHeight;
    item.open = true;
    tween(item, start, item.scrollHeight);
  }

  function initItem(item) {
    item.dataset.dsReady = 'true';
    const summary = item.querySelector('summary');
    if (!summary) return;
    // With motion the script owns the group, so the browser does not close the previous item at once.
    if (animated() && item.hasAttribute('name')) {
      item.dataset.dsGroup = item.getAttribute('name');
      item.removeAttribute('name');
    }
    summary.addEventListener('click', (event) => {
      if (!animated()) return; // native toggle
      event.preventDefault();
      if (item.open && !item.classList.contains('is-closing')) close(item);
      else {
        item.classList.remove('is-closing');
        open(item);
      }
    });
  }

  function initList(list) {
    list.dataset.dsReady = 'true';
    // "toggle" does not bubble, so the list listens in the capture phase. Items closing under the animation are left to it.
    list.addEventListener(
      'toggle',
      (event) => {
        const opened = event.target;
        if (!opened.matches?.('.ds-accordion__item') || !opened.open) return;
        list.querySelectorAll('.ds-accordion__item[open]').forEach((item) => {
          if (item !== opened && !item.classList.contains('is-closing') && item.closest('[data-ds-accordion]') === list) item.open = false;
        });
      },
      true,
    );
  }

  function init(root = document) {
    root.querySelectorAll('[data-ds-accordion][data-ds-single]:not([data-ds-ready])').forEach(initList);
    root.querySelectorAll(`:is(${ITEM}):not([data-ds-ready])`).forEach(initItem);
  }

  window.DS.accordion = { init };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();
})();
