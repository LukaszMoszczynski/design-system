# Card/Recommendation

Figma: Molecules → Card/Recommendation (`25:388`: Tone Default, Blue). DCC: blocks/programy (`.dcc-program--wyrozniony .dcc-program__card`, `.is-blue`).
CSS: `atoms/text/text.css`, `atoms/tag/tag.css`, `atoms/icon/icon.css`, `molecules/badge-circular/badge-circular.css`, `molecules/check-item/check-item.css` + `molecules/card-recommendation/card-recommendation.css`. No JS.

`renderCardRecommendation({ title, badgeText, reasons, benefitsLabel, benefits, tone, headingTag })` →
`<article class="ds-card-recommendation ds-card-recommendation--default"><div class="ds-card-recommendation__tab"><h3 class="ds-text ds-text--2xl ds-card-recommendation__title">…</h3></div><span class="ds-badge-circular ds-card-recommendation__badge" role="img" aria-label="…">…</span><div class="ds-card-recommendation__reasons"><ul class="ds-check-list">…</ul></div><p class="ds-card-recommendation__benefits-title">3 główne korzyści<svg class="ds-icon ds-icon--chevron-right" …></svg></p><ul class="ds-card-recommendation__benefits" role="list"><li class="ds-tag ds-tag--outline">…</li></ul></article>`.

- The badge is Badge/Circular with the check, 122 px, 24 px above the top-right corner; the card recolours it (primary disc,
  accent dot; Blue: accent disc, primary dot). Its wording is its accessible name.
- Blue: brand surface, on-brand texts (the Check list in its on-brand tone), accent pill, white pill borders, benefits in rows.
- Not a link, no states.

WordPress: `esc_html()` every text; one `<li>` per benefit line.
