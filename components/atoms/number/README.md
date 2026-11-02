# Number: letter circle, page number

Figma: Atoms → Navigation · Tags · Numbers → Letter circle (`21:144`), Page number (`21:157`).
DCC: `.dcc-model__letter`, `.dcc-model__word span` (blocks/model), the industry numbers, `.dcc-blog-lista__pagination .page-numbers`.
CSS: `atoms/number/number.css`. No JS (the model's hover wave and the industry switch are molecule/organism behaviour; they toggle `is-active`).

- `renderLetterCircle({ letter, context, active })` → `<span class="ds-letter-circle ds-letter-circle--step is-active?">E</span>`.
  Contexts: `step` (49 px), `word` (54 px with a 2 px page-colour border; the row overlaps them by `--model-word-overlap`),
  `industry` (47 px text-colour circle; active adds a 9 px accent ring outside).
- `renderPageNumber({ number, href, current })` → `<a class="ds-page-number" href>1</a>`, the current page
  `<span class="ds-page-number" aria-current="page">2</span>`. Desktop: 32 px, muted, current accent. Below 782 px:
  44 px soft pills in the heading font, current primary.

WordPress: `paginate_links()` prints `.page-numbers`/`.current`; map them to `ds-page-number` / `aria-current="page"` in the template.
