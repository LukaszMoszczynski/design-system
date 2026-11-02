# Call to action

Figma: Organisms → Call to action (`28:968`: Variant Large, Band, Gradient, Image, Light × Viewport Desktop / Mobile).
DCC: blocks/wezwanie (render.php, style.css; the `duzy`, `pasek`, `gradient`, `obraz` and `jasny` variants).
CSS: `atoms/icon/icon.css`, `atoms/text/text.css`, `atoms/button/button.css`, `atoms/link/link.css`,
`molecules/badge-circular/badge-circular.css` + `organisms/call-to-action/call-to-action.css`.
JS (optional): `base/reveal.js` (the content lifts in with GSAP when scrolled into view).

- `renderCallToAction({ variant, title, subtitle, text, buttons, image, imageAlt, badgeText, headingTag })`:
  - `variant`: `large` (default), `band`, `gradient`, `image`, `light`.
  - `title`, `subtitle`, `text`: given, they replace the variant's own Polish copy (`CTA_COPY`). The subtitle is shown on
    Large and Gradient only.
  - `buttons`: `[{ text, href }]`. Large and Band: Light buttons (Large with accent circles); Gradient: Accent + Light
    (primary text); Light: Accent + Primary; Image: uppercase `brand` text links.
  - `image`, `imageAlt`: the photo of Large (356 × 460) and Image (wide). `badgeText`: Large's Badge/Circular wording
    (empty: no badge). `headingTag`: `h2` (default) or `h3`.

  ```html
  <section class="ds-cta ds-cta--large">
    <div class="ds-cta__card">
      <div class="ds-cta__content" data-ds-reveal>
        <h2 class="ds-cta__title"><span class="ds-cta__title-box"><span class="ds-text ds-text--number ds-text--accent ds-cta__title-text">Nie wiesz, od czego zacząć?</span></span></h2>
        <p class="ds-text ds-text--xl ds-cta__subtitle">…</p>
        <p class="ds-text ds-text--body ds-cta__text">…</p>
        <div class="ds-cta__buttons"><a class="ds-button ds-button--light" href="tel:…">…</a>…</div>
      </div>
      <figure class="ds-cta__media"><img class="ds-cta__image" src="…" alt=""><span class="ds-badge-circular ds-cta__badge" …>…</span></figure>
    </div>
  </section>
  ```

  Gradient wraps the title and buttons in `div.ds-cta__main` and the subtitle and text in `div.ds-cta__aside`; Image puts
  the text and `div.ds-cta__links` in `div.ds-cta__aside` and its photo in `figure.ds-cta__media` after the content.
  Other variants use the title as a Text atom (`h2.ds-text.ds-text--{xl|4xl|3xl}.ds-cta__title`).
- Phones (≤ 781 px): the buttons stack at full width. Large becomes a full-bleed soft band without the photo (it reaches
  over the page gutter, so place it in a gutter-padded container); Band is full-bleed and left-aligned; Gradient, Image
  and Light stack into one column with phone type sizes.
- Motion: `data-ds-reveal` on the content. With `base/reveal.js` and `window.gsap` + `window.ScrollTrigger`, content
  below the fold fades in and rises 60 px (1 s, `power4.out`) when it scrolls into view; content already on screen, and
  everything with reduced motion or without GSAP, stays as it is.

WordPress: `esc_html()` the title, subtitle and text (or `wp_kses_post()` for inline links in the text), `esc_url()` the
button links (`tel:` and `mailto:` from the site options) and the photo. The variant is the block option printed into
the `ds-cta--{variant}` class.
