# Card/Post

Figma: Molecules → Card/Post (`25:277`: State Default, Hover × Arrow Accent, Primary; Viewport Mobile). DCC: `dcc_post_card()` (inc/blog.php), `.dcc-post-card--poziomy` (assets/css/components/post-card.css).
CSS: `atoms/tag/tag.css`, `atoms/text/text.css`, `atoms/button/button.css`, `atoms/icon/icon.css` + `molecules/card-post/card-post.css`. No JS.

`renderCardPost({ title, excerpt, date, datetime, image, href, arrow, headingTag })` →
`<a class="ds-card-post ds-card-post--arrow-accent" href><div class="ds-card-post__media"><img class="ds-card-post__image" src alt="" loading="lazy"><time class="ds-tag ds-tag--white" datetime="2016-04-26">26 kwietnia 2016</time></div><div class="ds-card-post__body"><h3 class="ds-text ds-text--2xl ds-card-post__title">…</h3><p class="ds-text ds-text--body ds-card-post__excerpt">…</p><span class="ds-button-arrow" aria-hidden="true">…</span></div></a>`.

- The whole card is one link with one focus ring. `arrow`: `accent` (carousel, blog grid) or `primary` (under a post);
  hover and focus swap the colour and zoom the photo 5 %.
- Desktop: photo and body side by side (1:1), 24 px padding and gap, radius 32, a 60 px arrow. Phones (≤ 781 px): stacked,
  16 px padding, radius 20, a 244 px photo, a 48 px arrow.

WordPress: `get_permalink()`, `get_the_post_thumbnail()` (`alt=""`: the title names the card), `get_the_date()` with
`get_the_date( 'c' )` for `datetime`.
