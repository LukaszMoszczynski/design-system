// Number atoms. Figma: Atoms → Navigation · Tags · Numbers → Letter circle (21:144), Page number (21:157).
// DCC: .dcc-model__letter / .dcc-model__word span (blocks/model), the industry numbers, .dcc-blog-lista__pagination .page-numbers.
import { escapeHtml } from '../../_shared/escape.js';

export const LETTER_VARIANTS = ['step', 'word', 'industry'];

// A letter or digit in a circle. Variant (Figma Context) step (49 px), word (54 px, page-colour border, overlapping in a row),
// industry (47 px, text-colour circle). Active (the hover wave / the open industry) turns it accent.
export function renderLetterCircle({ text = 'E', variant = 'step', active = false } = {}) {
  const variantName = LETTER_VARIANTS.includes(variant) ? variant : 'step';
  const classes = ['ds-letter-circle', `ds-letter-circle--${variantName}`, active ? 'is-active' : ''].filter(Boolean).join(' ');
  return `<span class="${classes}">${escapeHtml(text)}</span>`;
}

// A pagination number. The current page is a <span aria-current="page">, the others links.
export function renderPageNumber({ text = '1', href = '#', current = false } = {}) {
  if (current) return `<span class="ds-page-number" aria-current="page">${escapeHtml(text)}</span>`;
  return `<a class="ds-page-number" href="${escapeHtml(href)}">${escapeHtml(text)}</a>`;
}
