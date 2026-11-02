// Mobile menu: the phone navigation drawer under the header bar. Figma: Organisms → Mobile menu (102:296).
// DCC: blocks/naglowek (.dcc-mobile-menu, render.php + style.css).
// Rows of top-level links; an item with `offer` folds its sub-list in a <details> (the shared Accordion summary, so
// accordion.js animates its height) on the soft surface, ending with the „Zobacz całą ofertę” link. The footer holds the
// contact buttons (Accent, Primary) without their icon circle.
// mobile-menu.js opens it from the header's burger (aria-controls = `id`); it starts closed. `open`: rendered visible
// (the standalone story). The Oferta row is closed too (Figma's open sub-list is an example).
// Composes the Accordion summary and Button.
import { escapeHtml } from '../../_shared/escape.js';
import { renderButton } from '../../atoms/button/button.template.js';
import { renderAccordionSummary } from '../../molecules/accordion/accordion.template.js';

const AREAS = ['Rozwój top managementu i firmy', 'Rozwój liderów', 'Rozwój zespołów', 'Rozwój kluczowych specjalistów', 'Rozwój sprzedawców i BOK', 'Badania diagnostyczne'];

export const DEFAULT_MOBILE_ITEMS = [
  { text: 'Oferta', href: '#', offer: { links: AREAS.map((text) => ({ text, href: '#' })), allText: 'Zobacz całą ofertę', allHref: '#' } },
  { text: 'O nas', href: '#' },
  { text: 'Nasze standardy', href: '#' },
  { text: 'Metody i narzędzia', href: '#' },
  { text: 'Sklep', href: '#' },
  { text: 'Blog', href: '#' },
];

export const DEFAULT_MOBILE_BUTTONS = [
  { text: 'Dzwonię', href: 'tel:+48000000000' },
  { text: 'Piszę maila', href: 'mailto:kontakt@example.com' },
];

function renderOffer(item) {
  const links = item.offer.links.map((link) => `<li><a class="ds-mobile-menu__sublink" href="${escapeHtml(link.href)}">${escapeHtml(link.text)}</a></li>`);
  if (item.offer.allHref) {
    links.push(`<li><a class="ds-mobile-menu__all" href="${escapeHtml(item.offer.allHref)}">${escapeHtml(item.offer.allText || 'Zobacz wszystkie')}<span aria-hidden="true"> →</span></a></li>`);
  }
  return `<details class="ds-details ds-mobile-menu__offer">${renderAccordionSummary({ text: item.text, className: 'ds-mobile-menu__row' })}<ul class="ds-mobile-menu__sublist" role="list">${links.join('')}</ul></details>`;
}

export function renderMobileMenu({ id = 'ds-mobile-menu', items = DEFAULT_MOBILE_ITEMS, buttons = DEFAULT_MOBILE_BUTTONS, ariaLabel = 'Menu', open = false } = {}) {
  const rows = items
    .map((item) => {
      if (item.offer) return `<li>${renderOffer(item)}</li>`;
      return `<li><a class="ds-mobile-menu__row ds-mobile-menu__link" href="${escapeHtml(item.href)}"${item.current ? ' aria-current="page"' : ''}>${escapeHtml(item.text)}</a></li>`;
    })
    .join('');
  const footer = buttons.length
    ? `<div class="ds-mobile-menu__footer">${buttons.map((button, index) => renderButton({ text: button.text, href: button.href, variant: index === 0 ? 'accent' : 'primary' })).join('')}</div>`
    : '';
  return `<div class="ds-mobile-menu" id="${escapeHtml(id)}" data-ds-mobile-menu${open ? '' : ' hidden'}><nav class="ds-mobile-menu__nav" aria-label="${escapeHtml(ariaLabel)}"><ul class="ds-mobile-menu__list" role="list">${rows}</ul></nav>${footer}</div>`;
}
