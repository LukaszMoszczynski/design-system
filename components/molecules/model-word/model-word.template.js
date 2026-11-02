// Model word: the model's name spelled in overlapping letter circles (E-V-O-L-U-T-I-O-N).
// Figma: Molecules → Model word (25:305). DCC: blocks/model (.dcc-model__word). Letter circle atoms (word variant,
// 54 px with a 2 px page-colour border, −2 px overlap). Decorative: the steps carry the words, so the row is
// aria-hidden. `active` (0-based, −1 = none) lights one letter, as the section's hover wave does.
import { renderLetterCircle } from '../../atoms/number/number.template.js';

export function renderModelWord({ word = 'EVOLUTION', active = -1 } = {}) {
  const letters = Array.from(String(word)).map((letter, index) => renderLetterCircle({ text: letter, variant: 'word', active: index === Number(active) }));
  return `<p class="ds-model-word" aria-hidden="true">${letters.join('')}</p>`;
}
