// Number atoms. Figma: Atoms → Navigation · Tags · Numbers → Letter circle (21:144), Page number (21:157).
// DCC: .dcc-model__letter / .dcc-model__word span (blocks/model), the industry numbers, .dcc-blog-lista__pagination .page-numbers.
import { escapeHtml } from '../../_shared/escape.js';

export const LETTER_CONTEXTS = ['step', 'word', 'industry'];

// A letter or digit in a circle. Context step (49 px), word (54 px, page-colour border, overlapping in a row),
// industry (47 px, text-colour circle). Active (the hover wave / the open industry) turns it accent.
export function renderLetterCircle({ letter = 'E', context = 'step', active = false } = {}) {
  const contextName = LETTER_CONTEXTS.includes(context) ? context : 'step';
  const classes = ['ds-letter-circle', `ds-letter-circle--${contextName}`, active ? 'is-active' : ''].filter(Boolean).join(' ');
  return `<span class="${classes}">${escapeHtml(letter)}</span>`;
}

// A pagination number. The current page is a <span aria-current="page">, the others links.
export function renderPageNumber({ number = 1, href = '#', current = false } = {}) {
  if (current) return `<span class="ds-page-number" aria-current="page">${escapeHtml(number)}</span>`;
  return `<a class="ds-page-number" href="${escapeHtml(href)}">${escapeHtml(number)}</a>`;
}
