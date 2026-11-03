# FAQ

Figma: Sections → Section/FAQ (`130:918`: Viewport Desktop, two columns; Mobile, one column). DCC: blocks/faq (`.dcc-faq`).
CSS: `atoms/icon/icon.css`, `atoms/text/text.css`, `molecules/heading-group/heading-group.css`,
`molecules/accordion/accordion.css` + `sections/faq/faq.css`.
JS: `molecules/accordion/accordion.js` (`window.DS.accordion.init(root)`: the open / close height with GSAP, one open
with `single`); optional `base/reveal.js` (the heading lifts in with GSAP when scrolled into view).

- `renderFaq({ overline, title, lead, items, variant, single, headingTag })`:
  - `overline`, `title`, `lead`: the Heading group (Polish defaults; `lead: ''` leaves it out).
  - `items`: `[{ question, answer }]` (default the Accordion's `DEFAULT_FAQ`). Every item starts closed.
  - `variant`: `two-columns` (default; the first half left, the rest right, one list below 782 px) or `one-column` (588 px).
  - `single`: one item open at a time. `headingTag`: `h2` (default) or `h3`.

  ```html
  <section class="ds-faq ds-faq--two-columns">
    <div class="ds-faq__container">
      <div class="ds-faq__head" data-ds-reveal><header class="ds-heading-group ds-heading-group--stacked">…</header></div>
      <div class="ds-accordion ds-accordion--two-columns" data-ds-accordion>
        <div class="ds-accordion__column"><details class="ds-details ds-accordion__item"><summary class="ds-accordion-summary ds-accordion__summary">…</summary><div class="ds-accordion__answer">…</div></details>…</div>
        <div class="ds-accordion__column">…</div>
      </div>
    </div>
  </section>
  ```

- Layout: the container (1240 px), the Accordion 48 px under the heading (24 px on phones, `--space-heading-bottom`).

WordPress: print the markup in the FAQ block's `render.php` (`esc_html()` the questions, `wp_kses_post()` the answers);
the site also prints the FAQPage JSON-LD from the same rows.
