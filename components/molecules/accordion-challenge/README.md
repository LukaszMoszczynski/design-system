# Accordion/Challenge

Figma: Molecules → Accordion/Challenge (`25:211`: Desktop Collapsed, Hover, Expanded; Mobile Collapsed, Expanded).
DCC: blocks/lista-wyzwan (`.dcc-lista-wyzwan__item`).
CSS: `atoms/icon/icon.css`, `atoms/text/text.css`, `atoms/link/link.css` + `molecules/accordion-challenge/accordion-challenge.css`. No JS.

- `renderAccordionChallenge({ question, answer, linkText, href, name, open })` →

  ```html
  <details class="ds-accordion-challenge" name="wyzwania">
    <summary class="ds-accordion-challenge__summary">
      <span class="ds-accordion-challenge__icon" aria-hidden="true"><svg class="ds-icon ds-icon--plus ds-accordion-challenge__plus" …></svg><svg class="ds-icon ds-icon--minus ds-accordion-challenge__minus" …></svg></span>
      <span class="ds-accordion-challenge__question">Ludzie się po prostu nie dogadują</span>
    </summary>
    <div class="ds-accordion-challenge__body">
      <p class="ds-text ds-text--body ds-accordion-challenge__text">…</p>
      <a class="ds-link ds-link--inverse" href="…"><span class="ds-link__label">Zobacz program</span><svg …></svg></a>
    </div>
  </details>
  ```

- `renderAccordionChallengeList({ items, name })` → `<div class="ds-accordion-challenge-list">…</div>`. Every item gets
  the list's `name`, so the browser keeps one open (exclusive `<details>`). Rows are 22 px apart; phones get dividers instead.
- Desktop: a soft row; the open row is the brand surface with on-brand text and the inverse link. Phones (≤ 781 px): plain
  rows, the accent plus/minus on the right, the link in the text colour. Default state: closed.

WordPress: `esc_html()` question and answer, `esc_url()` the link; one `name` per block instance (for example `wp_unique_id( 'wyzwania-' )`).
