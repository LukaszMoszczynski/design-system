# Footer

Figma: Organisms → Footer (`28:1208`: Viewport Desktop 1352 px, Mobile 366 px). DCC: blocks/stopka (render.php, style.css).
CSS: `atoms/icon/icon.css`, `atoms/form-field/form-field.css`, `atoms/link/link.css`,
`atoms/social-button/social-button.css` + `organisms/footer/footer.css`. JS: none (every column is open, as in Figma).

- `renderFooter({ newsletter, logo, logoAlt, homeHref, homeAriaLabel, badges, hashtag, hashtagHref, about, office,
  contact, menu, menuAriaLabel, services, copyright, legal, tag })`:
  - `newsletter`: `{ title, lead, action }` (the accent panel with the Newsletter field in a `<form>`), or `null`.
  - `logo`, `badges` (`[{ src, alt }]`): images; an empty logo or a badge without `src` is the Figma placeholder.
  - `hashtag` / `hashtagHref`: the underlined link under the badges. `about`: the short company text.
  - `office`: `{ title, lines[] }` (an `<address>`). `contact`: `{ title, phone, email, social: [{ network, href }] }`
    (the phone becomes a `tel:` link, the e-mail a `mailto:` link, the Social row is raised).
  - `menu` (a nav landmark, `menuAriaLabel`) and `services`: `{ title, items: [{ text, href }] }`, Link/Footer lists.
  - `copyright`, `legal` (`[{ text, href }]`): the legal line. `tag`: `footer` (contentinfo, default) or `div`.

  ```html
  <footer class="ds-footer">
    <div class="ds-footer__card">
      <div class="ds-footer__newsletter"><h2 class="ds-footer__newsletter-title">…</h2><p class="ds-footer__newsletter-lead">…</p>
        <form class="ds-footer__form" action="…" method="post"><div class="ds-newsletter-field">…</div></form></div>
      <div class="ds-footer__grid">
        <div class="ds-footer__brand"><a class="ds-footer__logo" href="/" aria-label="…">…</a><div class="ds-footer__badges">…</div>
          <p class="ds-footer__tag"><a class="ds-footer__tag-link" href="…">#zdroweorganizacje</a></p><p class="ds-footer__about">…</p></div>
        <div class="ds-footer__columns">
          <div class="ds-footer__row">
            <div class="ds-footer__column ds-footer__column--office"><h2 class="ds-footer__title">Biuro</h2><address class="ds-footer__lines"><span>…</span></address></div>
            <div class="ds-footer__column ds-footer__column--contact"><h2 class="ds-footer__title">Kontakt</h2><div class="ds-footer__lines"><a class="ds-footer__line-link" href="tel:…">…</a>…</div><ul class="ds-social-list">…</ul></div>
          </div>
          <div class="ds-footer__row ds-footer__row--links">
            <nav class="ds-footer__column ds-footer__column--menu" aria-label="Menu w stopce"><h2 class="ds-footer__title">Menu</h2><ul class="ds-footer__links" role="list"><li><a class="ds-link ds-link--footer" href="…">…</a></li></ul></nav>
            <div class="ds-footer__column ds-footer__column--services">…</div>
          </div>
        </div>
      </div>
      <div class="ds-footer__legal"><p class="ds-footer__copyright">…</p><ul class="ds-footer__legal-links" role="list"><li><a class="ds-footer__legal-link" href="…">…</a></li></ul></div>
    </div>
  </footer>
  ```
- Layout: 480 px brand column, 88 px gap, 200 px columns; below 1100 px the brand column sits above the columns; on
  phones (≤ 781 px) everything stacks, the newsletter lead hides and the legal links go under the copyright. Give the
  footer 12 px of page margin on phones (DCC), 24 px and up on desktops.
- Links turn accent on hover; the focus ring is white on the blue card.

WordPress: the newsletter form is the site's form plugin output inside `.ds-footer__form` (keep the Newsletter field's
classes on the input and the submit); address, phone, e-mail, social links, services and legal links are theme options;
the menu is `wp_nav_menu` data. `esc_html()` / `esc_url()` each value, and print the current year in the copyright.
