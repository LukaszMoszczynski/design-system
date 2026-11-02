# Header

Figma: Organisms → Header (`28:1049`: State Default, Scrolled, Link states, Open × Viewport Desktop, + Mobile).
DCC: blocks/naglowek (render.php, view.js, style.css).
CSS: `atoms/icon/icon.css`, `atoms/nav-link/nav-link.css`, `atoms/button/button.css`, `molecules/accordion/accordion.css`,
`organisms/mega-menu/mega-menu.css`, `organisms/mobile-menu/mobile-menu.css` + `organisms/header/header.css`.
JS: `organisms/header/header.js` (scrolled, Mega menu), `organisms/mobile-menu/mobile-menu.js` (burger, drawer),
`molecules/accordion/accordion.js` (the drawer's Oferta row). Enqueue GSAP first for the motion.

- `renderHeader({ items, ctaText, ctaHref, logo, logoAlt, homeHref, homeAriaLabel, badge, badgeAlt, navAriaLabel,
  megaToggleAriaLabel, burgerAriaLabel, mega, mobileMenu, id, tag, open, scrolled })`:
  - `items`: `[{ text, href, current?, mega? }]`. `mega: true` adds the caret toggle of the Mega menu after the link.
  - `logo` / `badge`: image URLs; empty gives the Figma placeholder blocks. The badge hides up to 1024 px.
  - `mega`, `mobileMenu`: the args of `renderMegaMenu` / `renderMobileMenu` (the header sets their ids).
  - `id` (default `ds-header`): the panels get `{id}-mega` and `{id}-menu`. `tag`: `header` (the banner, default) or
    `div`. `open` / `scrolled`: rendered in that state (stories); at rest by default.

  ```html
  <header class="ds-header" data-ds-header>
    <div class="ds-header__bar">
      <div class="ds-header__brand"><a class="ds-header__logo" href="/" rel="home" aria-label="…">…</a><img class="ds-header__badge" …></div>
      <nav class="ds-header__nav" aria-label="Menu główne">
        <ul class="ds-header__menu" role="list">
          <li class="ds-header__item"><a class="ds-nav-link" href="…">Oferta</a><button type="button" class="ds-header__toggle" aria-expanded="false" aria-controls="ds-header-mega" aria-label="Pokaż menu oferty" data-ds-mega-toggle>…</button></li>
          <li class="ds-header__item"><a class="ds-nav-link" href="…" aria-current="page">Szkolenia</a></li>
        </ul>
      </nav>
      <div class="ds-header__actions"><a class="ds-nav-cta" href="tel:…">Dzwonię</a><button type="button" class="ds-nav-burger" aria-expanded="false" aria-label="Menu" aria-controls="ds-header-menu">…</button></div>
    </div>
    <div class="ds-mega-menu" id="ds-header-mega" data-ds-mega hidden>…</div>
    <div class="ds-mobile-menu" id="ds-header-menu" data-ds-mobile-menu hidden>…</div>
  </header>
  ```
- Layout: a 1281 px bar (`--header-width`), 40 px corners. Up to 1024 px the burger replaces the navigation and the bar
  is square and full width; at 781 px the header tokens switch to the 64 px phone bar. The header is not fixed by itself:
  place it in the page (DCC: a fixed wrapper 20 px from the top). The Mobile menu drawer is fixed under the bar.
- `header.js` (`window.DS.header.init(root)`):
  - `is-scrolled` as soon as `scrollY > 0` (markup rendered with it keeps it until the first scroll). With GSAP the
    shadow tweens (0.2 s).
  - The caret toggle opens and closes the Mega menu (`aria-expanded`, `hidden`). With a mouse on a desktop window it
    also opens on hover and closes 0.2 s after the pointer leaves. Escape closes it and returns focus to the toggle; so
    do a click outside the header and focus leaving the header. With GSAP the panel fades and drops 8 px in (0.3 s,
    `power1.out`).
  - An Escape already handled by a layer above (the drawer: `defaultPrevented`) or an open `<dialog>` is left alone.
  - Without GSAP or with reduced motion everything switches at once. Idempotent (`data-ds-ready`).

WordPress: the menu items come from the `wp_nav_menu` data (`esc_url()` the links, `esc_html()` the titles,
`aria-current="page"` on the current one); the phone number from the site options (`esc_url( 'tel:…' )`). Keep the ids
unique per page.
