// Numbered list: numbered steps in a 2XL medium heading style. Figma: Sections → Section/Text + image, Image left
// ("Numbered list"). DCC: .dcc-tekst-obraz__list (blocks/tekst-obraz). Each row is a Letter circle (step) and a Text
// 2XL medium line, 34 px apart, with a 1 px divider (none on the last). Hover: the row's number turns accent and grows.
// Composes Letter circle and Text.
import { renderLetterCircle } from '../../atoms/number/number.template.js';
import { renderText } from '../../atoms/text/text.template.js';

export const DEFAULT_NUMBERED_ITEMS = ['Diagnoza potrzeb i celów', 'Program szyty na miarę', 'Warsztaty i wdrożenie', 'Mierzenie efektów'];

export function renderNumberedList({ items = DEFAULT_NUMBERED_ITEMS } = {}) {
  const rows = items
    .map((item, index) => `<li class="ds-numbered-list__item">${renderLetterCircle({ text: String(index + 1) })}${renderText({ text: item, variant: '2xl-medium', tag: 'span', className: 'ds-numbered-list__text' })}</li>`)
    .join('');
  return `<ol class="ds-numbered-list" role="list">${rows}</ol>`;
}
