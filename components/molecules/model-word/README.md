# Model word

Figma: Molecules → Model word (`25:305`). DCC: blocks/model (`.dcc-model__word`).
CSS: `atoms/number/number.css` + `molecules/model-word/model-word.css`. No JS.

`renderModelWord({ word, active })` → `<p class="ds-model-word" aria-hidden="true"><span class="ds-letter-circle ds-letter-circle--word">E</span>…</p>`.
One word-variant Letter circle per character, overlapping by 2 px, centred and wrapping. It is decorative: the steps carry
the text. `active` (0-based, −1 = none) adds `is-active` to one letter; hovering a letter lights it too (accent, scaled 1.18).

WordPress: print one `<span>` per step letter with `esc_html()`.
