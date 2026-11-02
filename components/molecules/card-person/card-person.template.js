// Card/Person: the photo card of a trainer with the name box. Figma: Molecules → Card/Person (22:189).
// DCC: blocks/osoby (.dcc-osoby--siatka .dcc-osoba). The photo fills the card (cover); the name box sits 20 px from
// the edges. With href the whole card is one link (one focus ring); hover and focus zoom the photo 4 %.
// Composes the Text atom (name). `roles` are lines (the site separates the roles of one line with |).
import { escapeHtml } from '../../_shared/escape.js';
import { renderText } from '../../atoms/text/text.template.js';
import { CARD_HEADING_TAGS } from '../../_shared/heading-tags.js';

export function renderCardPerson({
  name = 'Anna Grygorcewicz',
  roles = ['Executive coaching  |  Coaching menedżerski', 'Gramy do jednej bramki  |  Konsulting'],
  image = './placeholders/portrait.svg',
  imageAlt = '',
  href = '#',
  headingTag = 'h3',
} = {}) {
  const tag = CARD_HEADING_TAGS.includes(headingTag) ? headingTag : 'h3';
  const photo = image ? `<span class="ds-card-person__photo"><img src="${escapeHtml(image)}" alt="${escapeHtml(imageAlt)}" loading="lazy"></span>` : '';
  const roleLines = [].concat(roles).filter(Boolean).map((line) => escapeHtml(line)).join('<br>');
  const body = `<div class="ds-card-person__body">${renderText({ text: name, variant: '2xl', tag, className: 'ds-card-person__name' })}${roleLines ? `<p class="ds-card-person__roles">${roleLines}</p>` : ''}</div>`;
  if (href) return `<a class="ds-card-person" href="${escapeHtml(href)}">${photo}${body}</a>`;
  return `<article class="ds-card-person">${photo}${body}</article>`;
}
