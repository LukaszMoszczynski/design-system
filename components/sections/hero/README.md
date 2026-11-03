# Hero

Figma: Sections → Section/Hero (`81:314`: Variant Large, Contact, Subpage light / violet / orange × Viewport Desktop;
Large and Subpage × Mobile). DCC: blocks/hero (render.php, style.css; `duzy`, `dcc-hero--kontakt`, `podstrona` with the
`jasny` / `fiolet` / `pomarancz` gradients).
CSS: `atoms/icon/icon.css`, `atoms/text/text.css`, `atoms/button/button.css`, `atoms/tag/tag.css`, `atoms/link/link.css`,
`atoms/breadcrumbs/breadcrumbs.css`, `molecules/card-hero-tile/card-hero-tile.css` + `sections/hero/hero.css`.
JS: none (the site reveals every section but the hero; the tiles' hover is CSS).

- `renderHero({ variant, title, titleAccent, lead, leadAccent, subtitle, button, tiles, image, imageAlt, illustration, breadcrumbs, headingTag })`:
  - `variant`: `large` (default), `contact`, `subpage-light`, `subpage-violet`, `subpage-orange`.
  - `title`, `lead`, `subtitle`: given (non-empty), they replace the variant's own Polish copy (`HERO_COPY`); `subtitle: ''`
    leaves it out. `titleAccent` / `leadAccent`: the part drawn in the accent colour (the first occurrence). The variant's
    accent applies only to its own copy.
  - `button`: `{ text, href }` of the Light button (Large and Contact; `accentIcon`: the accent circle at rest), `null` for none.
  - `tiles`: Card/Hero tile args (Large and Contact; default the three Figma tiles, titles as `h2`), `[]` for none.
  - `image`, `imageAlt`: the photo under the blue fade (Large and Contact; without it the box is plain brand blue).
  - `illustration`: the subpage art on the right (desktop only; decorative, `alt=""`).
  - `breadcrumbs`: Subpage trail `[{ text, href }]` (the Breadcrumbs atom): under the box on desktop, above it on phones.
  - `headingTag`: `h1` (default) or `h2`.

  ```html
  <section class="ds-hero ds-hero--large has-photo">
    <div class="ds-hero__box">
      <img class="ds-hero__photo" src="…" alt="" fetchpriority="high">
      <div class="ds-hero__inner">
        <div class="ds-hero__content">
          <h1 class="ds-hero__title"><span class="ds-text ds-text--4xl ds-text--mobile-3xl">Jak </span><span class="ds-text ds-text--4xl ds-text--mobile-3xl ds-text--accent">poukładać relacje i kompetencje</span><span class="ds-text ds-text--4xl ds-text--mobile-3xl"> w firmie…</span></h1>
          <p class="ds-hero__lead"><span class="ds-text ds-text--body">…</span></p>
          <div class="ds-hero__subtitle"><p class="ds-text ds-text--lg">…</p></div>
          <div class="ds-hero__buttons"><a class="ds-button ds-button--light ds-button--accent-icon" href="…">…</a></div>
        </div>
        <!-- subpages: <div class="ds-hero__illustration"><img src="…" alt=""></div> -->
      </div>
    </div>
    <ul class="ds-hero__tiles" role="list"><li class="ds-hero__tile"><a class="ds-card-hero-tile" href="…">…</a></li>…</ul>
    <!-- subpages: <div class="ds-hero__crumbs"><nav class="ds-breadcrumbs" …>…</nav></div> -->
  </section>
  ```

- Text styles: the title is Text 4XL with `mobile` 3XL (Large, Contact) or `overline` (Subpage); the lead Text body
  (Large), `lead-large` (Contact) or 3XL (Subpage); the subtitle Text LG, or `2xl-medium` with `mobile` body (Subpage).
  The section only colours its own wrappers (the title, the subtitle) and places them.
- Layout: Large / Contact an 800 px box, content 182 px down in a 700 px column, the tiles (1104 px row) overlapping
  its bottom by 65 px; Subpage a 420 px gradient box, content 142 px down. Tablets (≤ 1024 px) stack the tiles 16 px
  apart, 56 px below the box, and drop the illustration. Phones: Large / Contact show the 260 px photo above the brand
  panel; Subpage shows the title as an accent overline over a deep → primary box.
- Gradients: Subpage light soft → brand; violet brand-primary-deep → brand (60 %); orange accent → primary-deep (22 %) →
  brand (60 %). The site's dark end is its text colour; `--color-brand-primary-deep` is that colour in Light and stays dark
  in Dark (see the Task 9 report).

WordPress: print the markup in the hero block's `render.php`. Split the title and lead round the marked accent part and
print each part as a Text span (`esc_html()`); `esc_url()` the photo, the illustration and the button link; the tiles
are Card/Hero tile markup and the trail the Breadcrumbs markup.
