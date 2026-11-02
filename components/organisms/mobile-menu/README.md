# Mobile menu

Figma: Organisms → Mobile menu (`102:296`). DCC: blocks/naglowek (`.dcc-mobile-menu`).
CSS: `atoms/icon/icon.css`, `atoms/button/button.css`, `molecules/accordion/accordion.css` +
`organisms/mobile-menu/mobile-menu.css`. JS: `organisms/mobile-menu/mobile-menu.js` (the drawer) and
`molecules/accordion/accordion.js` (the Oferta row's height).

- `renderMobileMenu({ id, items, buttons, ariaLabel, open })`:
  - `items`: `[{ text, href, current?, offer? }]`; `offer: { links: [{ text, href }], allText, allHref }` folds a
    sub-list under the row (a `<details>` with the shared Accordion summary, closed at rest).
  - `buttons`: `[{ text, href }]`: the first Accent, the others Primary, full width without the icon circle.
  - `ariaLabel`: the nav landmark name. `open`: rendered without `hidden` (the standalone story).

  ```html
  <div class="ds-mobile-menu" id="ds-header-menu" data-ds-mobile-menu hidden>
    <nav class="ds-mobile-menu__nav" aria-label="Menu">
      <ul class="ds-mobile-menu__list" role="list">
        <li><details class="ds-details ds-mobile-menu__offer"><summary class="ds-accordion-summary ds-mobile-menu__row">…</summary>
          <ul class="ds-mobile-menu__sublist" role="list"><li><a class="ds-mobile-menu__sublink" href="…">…</a></li><li><a class="ds-mobile-menu__all" href="…">Zobacz całą ofertę<span aria-hidden="true"> →</span></a></li></ul></details></li>
        <li><a class="ds-mobile-menu__row ds-mobile-menu__link" href="…">O nas</a></li>
      </ul>
    </nav>
    <div class="ds-mobile-menu__footer"><a class="ds-button ds-button--accent" href="tel:…">…</a><a class="ds-button ds-button--primary" href="mailto:…">…</a></div>
  </div>
  ```
- Inside the Header it is a drawer, fixed under the bar and scrolling on its own.
- `mobile-menu.js` (`window.DS.mobileMenu.init(root)`), driven by the header's burger (`.ds-nav-burger[aria-controls]`):
  - the burger toggles it (`aria-expanded`, `hidden`);
  - while it is open the page cannot scroll (html `overflow: hidden`, with the scrollbar's width added as padding, so
    nothing jumps) and everything outside the header is `inert`;
  - Escape closes the drawer only and returns focus to the burger. It listens in the capture phase and calls
    `preventDefault`, so a Mega menu underneath waits for the next Escape; an open `<dialog>` above takes the key. A
    tapped link and widening the window to 1025 px close it too;
  - with GSAP it slides in from the right and out again (0.3 s, `power1.out`); without GSAP or with reduced motion it
    shows and hides at once. Idempotent (`data-ds-ready`).

WordPress: the same menu as the desktop navigation, the offer areas from the theme options; `esc_url()` / `esc_html()`
each value. The phone button's `aria-label` can say that it starts a call.
