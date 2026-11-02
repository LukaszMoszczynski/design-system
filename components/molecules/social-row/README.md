# Social row

Figma: Molecules → Social row (`76:177`, Style Plain / Raised). DCC: `dcc_social_list()`, `.dcc-social` (assets/css/components/social.css).
CSS: `atoms/social-button/social-button.css`. No JS.

`renderSocialRow({ items, variant })` → the Social button atom's list:
`<ul class="ds-social-list" role="list"><li><a class="ds-social-button ds-social-button--raised?" …></a></li>…</ul>`.
Default items: LinkedIn, Facebook, Instagram, YouTube (`DEFAULT_SOCIAL_ITEMS`), 4 px apart. `variant`: `plain` | `raised`
(the footer's row under its "Social media" label).

WordPress: one `<li>` per filled social URL (`esc_url()`).
