# Accordion

Figma: Molecules → Accordion/Item (`10:54`: Collapsed, Hover, Focus, Expanded) and Accordion (`10:121`: Layout Two columns, One column = `variant`).
DCC: blocks/faq (`.dcc-faq__item`, render.php, style.css).
CSS: `atoms/icon/icon.css`, `atoms/text/text.css` + `molecules/accordion/accordion.css`. JS (optional): `molecules/accordion/accordion.js`.

- `renderAccordionSummary({ text, className })`: the question row shared by every `<details>` molecule (Accordion,
  Accordion/Challenge, the Card/Training row). The `<details>` carries the base class `ds-details`.
  `accordion.css` holds one copy of the toggle contract with `accordion.js`:
  - the summary reset (no marker, pointer);
  - the focus ring;
  - the plus/minus swap on `.ds-details[open]:not(.is-closing)`.

  `className` adds the molecule's own look.
- `renderAccordionItem({ question, answer, open })` →

  ```html
  <details class="ds-details ds-accordion__item">
    <summary class="ds-accordion-summary ds-accordion__summary">
      <span class="ds-accordion-summary__text">Jak wygląda pierwsze spotkanie z trenerem?</span>
      <span class="ds-accordion-summary__icon" aria-hidden="true">
        <svg class="ds-icon ds-icon--plus ds-accordion-summary__plus" …></svg><svg class="ds-icon ds-icon--minus ds-accordion-summary__minus" …></svg>
      </span>
    </summary>
    <div class="ds-accordion__answer"><p class="ds-text ds-text--body">…</p></div>
  </details>
  ```

- `renderAccordion({ items: [{ question, answer, open? }], variant, single })` →
  `<div class="ds-accordion ds-accordion--{one-column|two-columns}" data-ds-accordion data-ds-single?><div class="ds-accordion__column">…</div></div>`.
  Two columns puts the first half of the items in the left column (64 px gap, container width) and stacks below 782 px.
- Default state: every item closed (Figma's open first row is an example).
- Native `<details>`: opening and closing work without JS, and the browser's find-in-page opens a matching item.
  `accordion.js` handles every `.ds-details`, so Accordion/Challenge and the Card/Training row too. It adds:
  - `data-ds-single`: opening an item closes the other open items of the same list.
  - With `window.gsap`: the height animates on open and close (0.3 s, `power1.out`, the site's 300 ms ease-out).
    - A closing item carries `is-closing`, so the open look ends with the height.
    - A `name` group moves to `data-ds-group`, so the previous item closes animated instead of at once.
  - Without GSAP or with reduced motion: native behaviour.

  Register: enqueue GSAP first, then the script. It auto-inits; call `window.DS.accordion.init(container)` after injecting
  markup. It is idempotent.

WordPress: one `<details>` per FAQ row; `esc_html()` the question, `wp_kses_post()` the answer (the answer box takes
paragraphs and lists). Add `data-ds-single` when the block option "one open at a time" is on.
