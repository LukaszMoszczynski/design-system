# Card/Testimonial

Figma: Molecules → Card/Testimonial (`95:118`: State Default, Active × Viewport Desktop, Mobile). DCC: blocks/opinie (`.dcc-opinia`).
CSS: `atoms/text/text.css` + `molecules/card-testimonial/card-testimonial.css`. No JS.

`renderCardTestimonial({ quote, author, role, photo, active })` →
`<figure class="ds-card-testimonial is-active?"><div class="ds-card-testimonial__top"><svg class="ds-card-testimonial__mark" …></svg></div><blockquote class="ds-card-testimonial__quote"><p class="ds-text ds-text--body">…</p></blockquote><figcaption class="ds-card-testimonial__caption"><img class="ds-card-testimonial__photo" src alt=""><span class="ds-card-testimonial__name"><span class="ds-text ds-text--xl ds-card-testimonial__author">…</span><span class="ds-text ds-text--body ds-card-testimonial__role">…</span></span></figcaption></figure>`.

- Soft card, radius 32, padding 36 28 52; the accent quote mark (inline SVG in currentColor, 82 px tall) right-aligned.
- `is-active` (the carousel centre slide, or a hovered product page card): the primary card with on-brand text.
- Phones (≤ 781 px): padding 24 20, radius 16, a 41 px mark, author 16, role 12.

WordPress: `esc_html()` quote (with `nl2br`), author and role; the photo with `alt=""` (the name follows).
