// Breadcrumbs: a wrapping trail of links, the last item is the current page.
// Figma: Atoms → Breadcrumbs (4:90 item, 4:91 separator, 4:159 trail). DCC: dcc_breadcrumbs() / .dcc-breadcrumbs.
// The › separators are CSS (::after of every item but the last), hidden from assistive tech.
import { escapeHtml } from '../../_shared/escape.js';

export const DEFAULT_TRAIL = [
  { label: 'Strona główna', href: '/' },
  { label: 'Szkolenia', href: '/szkolenia/' },
  { label: 'Negocjacje handlowe' },
];

export function renderBreadcrumbs({ items = DEFAULT_TRAIL, label = 'Ścieżka nawigacji' } = {}) {
  const list = items
    .map((item, index) => {
      const content =
        index === items.length - 1
          ? `<span class="ds-breadcrumbs__current" aria-current="page">${escapeHtml(item.label)}</span>`
          : `<a class="ds-breadcrumbs__link" href="${escapeHtml(item.href ?? '#')}">${escapeHtml(item.label)}</a>`;
      return `<li class="ds-breadcrumbs__item">${content}</li>`;
    })
    .join('');
  return `<nav class="ds-breadcrumbs" aria-label="${escapeHtml(label)}"><ol class="ds-breadcrumbs__list">${list}</ol></nav>`;
}
