# Text + image

Figma: Sections → Section/Text + image (`91:219`: Variant Image right, Image left, Panorama, Centered, Photos × Desktop;
Image right and Panorama × Mobile). DCC: blocks/tekst-obraz (render.php, style.css; `obraz-prawo`, `obraz-lewo`,
`panorama`, `srodek`, `zdjecia`).
CSS: `atoms/icon/icon.css`, `atoms/text/text.css`, `atoms/button/button.css`, `atoms/link/link.css`,
`atoms/number/number.css`, `molecules/heading-group/heading-group.css`, `molecules/badge-circular/badge-circular.css`
+ `sections/text-image/text-image.css`.
JS (optional): `base/reveal.js` (the text and the photos lift in with GSAP when scrolled into view).

- `renderTextImage({ variant, overline, title, text, steps, actions, image, imageAlt, image2, image2Alt, background, badgeText, headingTag })`:
  - `variant`: `image-right` (default), `image-left`, `panorama`, `centered`, `photos`.
  - `overline`, `title`, `text`, `steps`, `actions`: default the variant's own Polish copy (`TEXT_IMAGE_COPY`); an empty
    `title` falls back to it, `overline: ''` / `text: ''` / `steps: []` / `actions: []` leave the part out.
  - `steps`: strings, the numbered list (Letter circle + 2XL text; Image left's default content).
  - `actions`: `[{ text, href }]`: Primary then Light buttons (Centered: Accent, uppercase); Panorama: uppercase
    `arrow` text links.
  - `image` / `image2` (+ alts): the photo (Photos: the wide one, then the narrow one). Without an image the frame keeps
    the muted placeholder colour.
  - `background`: Centered's faint illustration (20 %, decorative). `badgeText`: Photos' Badge/Circular (empty: none).
  - `headingTag`: `h2` (default) or `h3`.

  ```html
  <section class="ds-text-image ds-text-image--image-right">
    <div class="ds-text-image__container ds-text-image__grid">
      <div class="ds-text-image__text" data-ds-reveal>
        <header class="ds-heading-group ds-heading-group--stacked">…</header>
        <p class="ds-text ds-text--body ds-text-image__prose">…</p>
        <!-- image-left: <ol class="ds-text-image__steps" role="list"><li class="ds-text-image__step"><span class="ds-letter-circle ds-letter-circle--step">1</span><span class="ds-text ds-text--2xl ds-text-image__step-text">…</span></li>…</ol> -->
        <div class="ds-text-image__buttons"><a class="ds-button ds-button--primary" href="…">…</a></div>
      </div>
      <figure class="ds-text-image__media" data-ds-reveal><img class="ds-text-image__image" src="…" alt="…" loading="lazy"></figure>
    </div>
  </section>
  ```

  Panorama: `div.ds-text-image__split[data-ds-reveal]` (Heading group + `div.ds-text-image__aside` with the prose and
  `div.ds-text-image__links`), then `figure.ds-text-image__media.ds-text-image__media--wide`. Centered:
  `img.ds-text-image__background` before the container. Photos: `div.ds-text-image__head[data-ds-reveal]` in the
  container, then `div.ds-text-image__trio` (photo, `div.ds-text-image__card` with the prose and
  `.ds-badge-circular.ds-text-image__badge`, photo).
- Layout: two equal columns 72 px apart (Image right / left, 4:3 photo); Panorama 690 | 365 with a 140 px gap over a
  1200 × 518 photo; Centered 900 px; Photos a 1140 px heading 120 px above a 786 · 276 · 282 row 326 px high (1392 px max).
  Panorama stacks below 1025 px, Photos below 901 px, the rest below 782 px (photo first, radius 20, full-width buttons).

WordPress: print the markup in the block's `render.php`; the prose is `wp_kses_post()` (the site's `.dcc-prose`), the
steps `esc_html()` lines, the photos `esc_url()` with their alt (`esc_attr()`).
