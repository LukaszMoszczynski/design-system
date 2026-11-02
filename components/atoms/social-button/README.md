# Social button

Figma: Atoms → Social (`76:73` Icon/Social, `76:112` Social button). DCC: `dcc_social_list()` (inc/helpers.php), `.dcc-social` (assets/css/components/social.css), `assets/img/social-<network>.svg`.
CSS: `atoms/social-button/social-button.css`. No JS.

- `renderSocialButton({ network, href, ariaLabel, variant })` (`variant`: `plain` | `raised`) →
  `<a class="ds-social-button ds-social-button--raised?" href target="_blank" rel="noopener" aria-label="LinkedIn"><svg class="ds-social-button__icon" viewBox="0 0 44 44" …></svg></a>`.
  Networks: `linkedin`, `facebook`, `instagram`, `youtube`, `spotify` (glyphs in `SOCIAL_ICONS`, drawn on a 44 px square).
- `renderSocialList({ items: [{ network, href, ariaLabel? }], variant })` → `<ul class="ds-social-list" role="list"><li>…</li></ul>`, 4 px apart.
- Plain: no circle at rest. Raised: page-colour circle that scales 1.08 with Shadow/Lift on hover/focus. Both fill accent
  with an on-brand glyph on hover/focus; focus adds the ring.

WordPress: `esc_url()` for `href`, `esc_attr()` for the accessible name; paste the glyph SVG for each network.
