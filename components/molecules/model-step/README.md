# Model step

Figma: Molecules → Model step (`25:304`: Default, Hover). DCC: blocks/model (`.dcc-model__step`).
CSS: `atoms/number/number.css` + `molecules/model-step/model-step.css`. No JS.

- `renderModelStep({ letter, term, text, active })` →
  `<li class="ds-model-step"><span class="ds-model-step__letter" aria-hidden="true"><span class="ds-letter-circle ds-letter-circle--step">E</span></span><p class="ds-model-step__text"><strong>EXPERT'S LOOK</strong> Rzetelnie…</p></li>`.
- `renderModelSteps({ items })` → `<ol class="ds-model-steps" role="list">…</ol>` (no divider under the last step).
- Hover: the letter turns accent and scales 1.18, the text 1.03 (no scaling with reduced motion). `active` (`is-active`)
  gives the same look for the model section's double hover, where the matching Model word letter lights the step.

WordPress: `esc_html()` letter, term and text.
