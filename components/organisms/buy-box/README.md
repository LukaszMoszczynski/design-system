# Buy box

Figma: Organisms → Buy box (`102:239`). DCC: blocks/produkt, inc/shop/buy-box.php (`.dcc-buy`, view.js).
CSS: `atoms/icon/icon.css`, `atoms/form-field/form-field.css`, `atoms/button/button.css` + `organisms/buy-box/buy-box.css`.
JS: `organisms/buy-box/buy-box.js` (`window.DS.buyBox.init(root)`).

- `renderBuyBox({ gross, net, terms, term, termLabel, quantityLabel, seats, facts, buttonText, priceModeAriaLabel, action, id })`:
  - `gross`, `net`: the unit prices in złoty (numbers), printed with `formatPrice()` („1 490 zł”, „1 211,38 zł”, no-break
    spaces, grosze only when there are any).
  - `terms` (`[{ value, text }]`) and `term`: the term select (Form field). `seats`: the quantity maximum.
  - `facts`: `[{ label, value }]` (Kiedy, Godziny, Czas trwania, Gdzie). `buttonText`: the Accent submit.
  - `id`: the form id and the prefix of the field ids; `action`: the form action (the cart).

  ```html
  <form class="ds-buy-box" id="ds-buy-box" action="…" method="post" data-ds-buy-box data-ds-gross="1490" data-ds-net="1211.38">
    <div class="ds-buy-box__price">
      <p class="ds-buy-box__amount" data-ds-buy-amount>1 490 zł</p>
      <p class="ds-buy-box__note" data-ds-buy-note>brutto · 1 211,38 zł netto</p>
      <div class="ds-buy-box__modes" role="group" aria-label="Pokaż cenę">
        <button type="button" class="ds-buy-box__mode" data-ds-price-mode="brutto" aria-pressed="true">brutto</button>
        <button type="button" class="ds-buy-box__mode" data-ds-price-mode="netto" aria-pressed="false">netto</button>
      </div>
    </div>
    <div class="ds-field ds-field--select">…</div>
    <div class="ds-buy-box__quantity" role="group" aria-labelledby="ds-buy-box-quantity-label">
      <p class="ds-buy-box__label" id="ds-buy-box-quantity-label">Liczba miejsc</p>
      <div class="ds-buy-box__row"><div class="ds-quantity" data-ds-quantity>…</div><p class="ds-buy-box__total" data-ds-buy-total aria-live="polite">Razem: 1 490 zł</p></div>
    </div>
    <dl class="ds-buy-box__facts"><div class="ds-buy-box__fact"><dt class="ds-buy-box__fact-label"><span class="ds-buy-box__fact-icon" aria-hidden="true"></span>Kiedy</dt><dd class="ds-buy-box__fact-value">12–13 marca 2026</dd></div>…</dl>
    <button type="submit" class="ds-button ds-button--accent">…</button>
  </form>
  ```
- `buy-box.js`: the brutto / netto switch shows the price, the note and the total in that mode (`aria-pressed` on the
  pressed half); the stepper's minus and plus step the quantity, a typed quantity goes back within 1…seats, and the total
  is unit × quantity. Without the script the form posts as it is and shows the brutto price. No motion. Idempotent.
- The fact icons are Figma's accent ring placeholders (the Icons set has no calendar, clock or pin glyph yet).

WordPress: print the prices from the product (`esc_attr()` the data attributes, `esc_html()` the formatted text), the
terms from the variations and the facts from the product fields; `max` of the quantity is the stock. The submit posts to
the cart (`add-to-cart`).
