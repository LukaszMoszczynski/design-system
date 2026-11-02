# Accordion/Challenge

Figma: Molecules → Accordion/Challenge (`25:211`: Desktop Collapsed, Hover, Expanded; Mobile Collapsed, Expanded).
DCC: blocks/lista-wyzwan (`.dcc-lista-wyzwan__item`).
CSS: `atoms/icon/icon.css`, `atoms/text/text.css`, `atoms/link/link.css`, `molecules/accordion/accordion.css` (the shared summary) + `molecules/accordion-challenge/accordion-challenge.css`.
JS (optional, motion only): `molecules/accordion/accordion.js` (GSAP height animation; see the Accordion README).

- `renderAccordionChallenge({ question, answer, linkText, href, name, open })` →

  ```html
  <details class="ds-details ds-accordion-challenge" name="wyzwania">
    <summary class="ds-accordion-summary ds-accordion-challenge__summary">…the shared renderAccordionSummary (Accordion README)…</summary>
    <div class="ds-accordion-challenge__body">
      <p class="ds-text ds-text--body ds-accordion-challenge__text">…</p>
      <a class="ds-link ds-link--inverse" href="…"><span class="ds-link__label">Zobacz program</span><svg …></svg></a>
    </div>
  </details>
  ```

- `renderAccordionChallengeList({ items, name })` → `<div class="ds-accordion-challenge-list">…</div>`. Every item gets
  the list's `name`, so the browser keeps one open (exclusive `<details>`). Rows are 22 px apart; phones get dividers instead.
- Desktop: a soft row; the open row is the brand surface with on-brand text and the inverse link. Phones (≤ 781 px): plain
  rows, the accent plus/minus on the right, the link in the text colour. Default state: closed. The plus/minus is the shared summary icon, placed first on desktop (CSS order).

WordPress: `esc_html()` question and answer, `esc_url()` the link; one `name` per block instance (for example `wp_unique_id( 'wyzwania-' )`).
