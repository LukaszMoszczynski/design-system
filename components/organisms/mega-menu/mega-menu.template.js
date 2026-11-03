// Mega menu: the desktop offer panel under the header's „Oferta”. Figma: Organisms → Mega menu (59:51).
// DCC: blocks/naglowek (.dcc-mega, render.php + style.css).
// Three parts: the bestsellers band („Szczególnie polecamy”), the offer areas (name, program links, „Zobacz wszystkie”),
// and the shop band with a Light pill button. header.js opens and closes it (hidden attribute, aria-expanded on the
// toggle); it starts closed. `open`: rendered visible (the standalone story).
// Composes Icon and Button.
import { escapeHtml } from '../../_shared/escape.js';
import { renderButton } from '../../atoms/button/button.template.js';
import { renderIcon } from '../../atoms/icon/icon.template.js';

export const DEFAULT_BESTSELLERS = [
  { title: 'Akademia Kompetencji Menedżerskich', text: 'Program rozwoju kompetencji przywódczych i zarządzania', href: '#' },
  { title: 'Gramy do jednej bramki', text: 'Warsztaty wzmacniające relacje i osiąganie wyników', href: '#' },
  { title: 'Samotny bohater?', text: 'Executive coaching z elementami mentoringu', href: '#' },
];

export const DEFAULT_AREAS = [
  { name: 'Rozwój top managementu i firmy', links: ['Zdrowa Organizacja: konsultacje dla szefów', 'Coaching dla zarządu i kadry kierowniczej'], href: '#' },
  { name: 'Rozwój liderów', links: ['Plecak menedżerski START', 'Stop mobbingowi i dyskryminacji'], href: '#' },
  { name: 'Rozwój zespołów', links: ['Od talentów do mocnych stron', 'Team coaching'], href: '#' },
  { name: 'Rozwój kluczowych specjalistów', links: ['Sztuka coachingu dla HR', 'Dobre praktyki trenera wewnętrznego'], href: '#' },
  { name: 'Rozwój sprzedawców i BOK', links: ['Fokus na klienta', 'Level Up – sprzedaż na wyższym poziomie'], href: '#' },
  { name: 'Badania diagnostyczne', links: ['PCM® dla menedżerów i liderów', 'Od talentów do mocnych stron. Program rozwojowy oparty na Gallup CliftonStrengths®'], href: '#' },
].map((area) => ({ ...area, links: area.links.map((text) => ({ text, href: '#' })) }));

export const DEFAULT_SHOP = { title: 'Szkolenia otwarte i konsultacje', text: 'Kupisz od ręki — z ceną i terminem, bez rozmowy handlowej', buttonText: 'Do sklepu', href: '#' };

export function renderMegaMenu({
  id = 'ds-mega-menu',
  text = 'Szczególnie polecamy',
  bestsellers = DEFAULT_BESTSELLERS,
  areas = DEFAULT_AREAS,
  allText = 'Zobacz wszystkie',
  shop = DEFAULT_SHOP,
  open = false,
} = {}) {
  const bestsellerItems = bestsellers
    .map(
      (item) =>
        `<li><a class="ds-mega-menu__bestseller" href="${escapeHtml(item.href)}"><span class="ds-mega-menu__bestseller-title">${escapeHtml(item.title)}</span>${item.text ? `<span class="ds-mega-menu__bestseller-text">${escapeHtml(item.text)}</span>` : ''}</a></li>`,
    )
    .join('');
  const top = bestsellers.length
    ? `<div class="ds-mega-menu__bestsellers"><p class="ds-mega-menu__label">${escapeHtml(text)}</p><ul class="ds-mega-menu__bestseller-list" role="list">${bestsellerItems}</ul></div>`
    : '';
  const areaItems = areas
    .map((area) => {
      const links = area.links.map((link) => `<li><a class="ds-mega-menu__link" href="${escapeHtml(link.href)}">${escapeHtml(link.text)}</a></li>`).join('');
      const all = area.href ? `<a class="ds-mega-menu__all" href="${escapeHtml(area.href)}"><span>${escapeHtml(allText)}</span>${renderIcon({ name: 'chevron-right' })}</a>` : '';
      return `<li class="ds-mega-menu__area"><p class="ds-mega-menu__area-name">${escapeHtml(area.name)}</p><ul class="ds-mega-menu__links" role="list">${links}</ul>${all}</li>`;
    })
    .join('');
  const middle = areas.length ? `<ul class="ds-mega-menu__areas" role="list">${areaItems}</ul>` : '';
  const bottom = shop
    ? `<div class="ds-mega-menu__shop"><div class="ds-mega-menu__shop-text"><p class="ds-mega-menu__shop-title">${escapeHtml(shop.title)}</p><p class="ds-mega-menu__shop-desc">${escapeHtml(shop.text)}</p></div>${renderButton({ text: shop.buttonText, href: shop.href, variant: 'light', shape: 'pill' })}</div>`
    : '';
  return `<div class="ds-mega-menu" id="${escapeHtml(id)}" data-ds-mega${open ? '' : ' hidden'}>${top}${middle}${bottom}</div>`;
}
