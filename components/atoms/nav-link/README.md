# Nav link, Nav CTA, Burger

Figma: Atoms → Navigation · Tags · Numbers → Nav link (`21:170`), Nav CTA (`21:179`), Icon/Burger (`21:187`).
DCC: `.dcc-header__link`, `.dcc-header__cta`, `.dcc-header__burger` (blocks/naglowek/style.css).
CSS: `atoms/nav-link/nav-link.css`. No JS: the header organism toggles the burger's `aria-expanded`.

| Function | Markup |
| --- | --- |
| `renderNavLink({ text, href, current })` | `<a class="ds-nav-link" href aria-current="page"?>Oferta</a>` |
| `renderNavCta({ text, href })` | `<a class="ds-nav-cta" href="tel:…">Dzwonię</a>` |
| `renderNavBurger({ open, ariaLabel, controls })` | `<button type="button" class="ds-nav-burger" aria-expanded="false" aria-label="Menu" aria-controls?><span class="ds-nav-burger__lines"></span></button>` |

- Nav link: hover/focus accent with a hairline faux-bold (text-shadow, no width jump) and a 2 px accent line 6 px below; current: primary, bold.
- Nav CTA: accent pill, page-colour label; hover/focus the inverse surface. Below 782 px the header tokens make it 36 px tall
  and the label switches to the heading font 500 16. (The site's 44 px round phone icon on the smallest phones is not built:
  no phone icon in the Icons set.)
- Burger: three 24 × 2 lines 8 px apart; `aria-expanded="true"` folds them into an ×.

WordPress: `esc_url()` / `esc_html()`; print `aria-current="page"` on the current menu item.
