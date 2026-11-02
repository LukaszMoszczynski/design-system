// Footer: the blue card at the bottom of every page. Figma: Organisms → Footer (28:1208, Viewport Desktop / Mobile).
// DCC: blocks/stopka (render.php, style.css).
// The accent newsletter panel (title, lead, the Newsletter field in a <form>), then the brand column (logo, badges,
// the #hashtag link, about text) beside two rows of columns: Biuro and Kontakt (with the raised Social row), a divider,
// Menu and Usługi (Link/Footer lists); last the legal line. Figma's mobile footer stacks every column open, so it has no
// script. Composes Newsletter field, Link, Social row.
import { escapeHtml } from '../../_shared/escape.js';
import { renderNewsletterField } from '../../atoms/form-field/form-field.template.js';
import { renderLink } from '../../atoms/link/link.template.js';
import { DEFAULT_SOCIAL_ITEMS, renderSocialRow } from '../../molecules/social-row/social-row.template.js';

export const FOOTER_TAGS = ['footer', 'div'];

const links = (texts) => texts.map((text) => ({ text, href: '#' }));

export const DEFAULT_FOOTER = {
  newsletter: { title: 'Zapisz się na newsletter', lead: 'Raz w miesiącu: praktyczna wiedza o przywództwie, komunikacji i zdrowych organizacjach. Bez spamu.', action: '#' },
  office: { title: 'Biuro', lines: ['DCC Grygorcewicz', 'ul. Przykładowa 12/3', '70-001 Szczecin'] },
  contact: { title: 'Kontakt', phone: '+48 600 000 000', email: 'biuro@dcc.pl', social: DEFAULT_SOCIAL_ITEMS },
  menu: { title: 'Menu', items: links(['Oferta', 'Szkolenia', 'Metody', 'O nas', 'Blog', 'Kontakt']) },
  services: { title: 'Usługi', items: links(['Szkolenia dla liderów', 'Szkolenia dla zespołów sprzedaży', 'Coaching menedżerski', 'Badania 360 i Insights Discovery']) },
  legal: links(['Polityka prywatności', 'Regulamin', 'Cookies']),
};

const linkList = (items) => `<ul class="ds-footer__links" role="list">${items.map((item) => `<li>${renderLink({ text: item.text, href: item.href, variant: 'footer' })}</li>`).join('')}</ul>`;
const telHref = (phone) => `tel:${String(phone).replace(/[^\d+]/g, '')}`;

function renderNewsletter(newsletter) {
  if (!newsletter) return '';
  const lead = newsletter.lead ? `<p class="ds-footer__newsletter-lead">${escapeHtml(newsletter.lead)}</p>` : '';
  return `<div class="ds-footer__newsletter"><h2 class="ds-footer__newsletter-title">${escapeHtml(newsletter.title)}</h2>${lead}<form class="ds-footer__form" action="${escapeHtml(newsletter.action ?? '#')}" method="post">${renderNewsletterField()}</form></div>`;
}

function renderBrand({ logo, logoAlt, homeHref, homeAriaLabel, badges, hashtag, hashtagHref, about }) {
  const logoMark = logo ? `<img class="ds-footer__logo-image" src="${escapeHtml(logo)}" alt="${escapeHtml(logoAlt)}">` : '<span class="ds-footer__logo-placeholder" aria-hidden="true"></span>';
  const badgeMarks = badges
    .map((badge) => (badge.src ? `<img class="ds-footer__badge" src="${escapeHtml(badge.src)}" alt="${escapeHtml(badge.alt ?? '')}">` : '<span class="ds-footer__badge ds-footer__badge--placeholder" aria-hidden="true"></span>'))
    .join('');
  return [
    '<div class="ds-footer__brand">',
    `<a class="ds-footer__logo" href="${escapeHtml(homeHref)}" aria-label="${escapeHtml(homeAriaLabel)}">${logoMark}</a>`,
    badges.length ? `<div class="ds-footer__badges">${badgeMarks}</div>` : '',
    hashtag ? `<p class="ds-footer__tag"><a class="ds-footer__tag-link" href="${escapeHtml(hashtagHref)}">${escapeHtml(hashtag)}</a></p>` : '',
    about ? `<p class="ds-footer__about">${escapeHtml(about)}</p>` : '',
    '</div>',
  ].join('');
}

export function renderFooter({
  newsletter = DEFAULT_FOOTER.newsletter,
  logo = '',
  logoAlt = '',
  homeHref = '/',
  homeAriaLabel = 'DCC Grygorcewicz — strona główna',
  badges = [{}, {}],
  hashtag = '#zdroweorganizacje',
  hashtagHref = '#',
  about = 'DCC Grygorcewicz: szkolenia, coaching i doradztwo dla liderów i zespołów. Od 2008 roku pomagamy firmom budować zdrowe organizacje.',
  office = DEFAULT_FOOTER.office,
  contact = DEFAULT_FOOTER.contact,
  menu = DEFAULT_FOOTER.menu,
  menuAriaLabel = 'Menu w stopce',
  services = DEFAULT_FOOTER.services,
  copyright = '© 2026 DCC Grygorcewicz. Wszystkie prawa zastrzeżone.',
  legal = DEFAULT_FOOTER.legal,
  tag = 'footer',
} = {}) {
  const tagName = FOOTER_TAGS.includes(tag) ? tag : 'footer';
  const title = (text) => `<h2 class="ds-footer__title">${escapeHtml(text)}</h2>`;
  const officeColumn = `<div class="ds-footer__column ds-footer__column--office">${title(office.title)}<address class="ds-footer__lines">${office.lines.map((line) => `<span>${escapeHtml(line)}</span>`).join('')}</address></div>`;
  const contactLines = [
    contact.phone ? `<a class="ds-footer__line-link" href="${escapeHtml(telHref(contact.phone))}">${escapeHtml(contact.phone)}</a>` : '',
    contact.email ? `<a class="ds-footer__line-link" href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a>` : '',
  ].join('');
  const contactColumn = `<div class="ds-footer__column ds-footer__column--contact">${title(contact.title)}<div class="ds-footer__lines">${contactLines}</div>${contact.social?.length ? renderSocialRow({ items: contact.social, variant: 'raised' }) : ''}</div>`;
  const menuColumn = `<nav class="ds-footer__column ds-footer__column--menu" aria-label="${escapeHtml(menuAriaLabel)}">${title(menu.title)}${linkList(menu.items)}</nav>`;
  const servicesColumn = services?.items?.length ? `<div class="ds-footer__column ds-footer__column--services">${title(services.title)}${linkList(services.items)}</div>` : '';
  const columns = `<div class="ds-footer__columns"><div class="ds-footer__row">${officeColumn}${contactColumn}</div><div class="ds-footer__row ds-footer__row--links">${menuColumn}${servicesColumn}</div></div>`;
  const legalLinks = legal.length ? `<ul class="ds-footer__legal-links" role="list">${legal.map((item) => `<li><a class="ds-footer__legal-link" href="${escapeHtml(item.href)}">${escapeHtml(item.text)}</a></li>`).join('')}</ul>` : '';
  const legalLine = `<div class="ds-footer__legal"><p class="ds-footer__copyright">${escapeHtml(copyright)}</p>${legalLinks}</div>`;
  return `<${tagName} class="ds-footer"><div class="ds-footer__card">${renderNewsletter(newsletter)}<div class="ds-footer__grid">${renderBrand({ logo, logoAlt, homeHref, homeAriaLabel, badges, hashtag, hashtagHref, about })}${columns}</div>${legalLine}</div></${tagName}>`;
}
