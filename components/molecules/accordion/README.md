# Accordion

Figma: Molecules → Accordion/Item (`10:54`: Collapsed, Hover, Focus, Expanded) and Accordion (`10:121`: Two columns, One column).
DCC: blocks/faq (`.dcc-faq__item`, render.php, style.css).
CSS: `atoms/icon/icon.css`, `atoms/text/text.css` + `molecules/accordion/accordion.css`. JS (optional): `molecules/accordion/accordion.js`.

- `renderAccordionItem({ question, answer, open })` →

  ```html
  <details class="ds-accordion__item">
    <summary class="ds-accordion__summary">
      <span class="ds-accordion__question">Jak wygląda pierwsze spotkanie z trenerem?</span>
      <span class="ds-accordion__icon" aria-hidden="true">
        <svg class="ds-icon ds-icon--plus ds-accordion__plus" …></svg><svg class="ds-icon ds-icon--minus ds-accordion__minus" …></svg>
      </span>
    </summary>
    <div class="ds-accordion__answer"><p class="ds-text ds-text--body">…</p></div>
  </details>
  ```

- `renderAccordion({ items: [{ question, answer, open? }], layout, single })` →
  `<div class="ds-accordion ds-accordion--{one-column|two-columns}" data-ds-accordion data-ds-single?><div class="ds-accordion__column">…</div></div>`.
  Two columns puts the first half of the items in the left column (64 px gap, container width) and stacks below 782 px.
- Default state: every item closed (Figma's open first row is an example).
- Native `<details>`: opening and closing work without JS, and the browser's find-in-page opens a matching item.
  `accordion.js` (also used by Accordion/Challenge) adds:
  - `data-ds-single`: opening an item closes the other open items of the same list;
  - with `window.gsap`: the height animates on open and close (0.3 s, `power1.out`, the site's 300 ms ease-out); a closing
    item carries `is-closing`, so the open look ends with the height. A `name` group moves to `data-ds-group`, so the
    previous item closes animated instead of at once. Without GSAP or with reduced motion: native behaviour.
  Register: enqueue GSAP first, then the script; it auto-inits, `window.DS.accordion.init(container)` after injecting
  markup. Idempotent.

WordPress: one `<details>` per FAQ row; `esc_html()` the question, `wp_kses_post()` the answer (the answer box takes
paragraphs and lists). Add `data-ds-single` when the block option "one open at a time" is on.
