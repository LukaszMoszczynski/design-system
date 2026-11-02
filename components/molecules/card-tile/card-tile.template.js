// Card/Tile: the accreditation tile. Figma: Molecules → Card/Tile (8:138). DCC: blocks/karty (.dcc-karty--akredytacja).
// The 2XL title sits in a 20 px-radius box that is invisible at rest; hover and focus turn the card brand blue and the
// box page-coloured with a primary title. With href the whole card is one link (one focus ring).
// Composes the Text atom (title, subtitle, description).
import { escapeHtml } from '../../_shared/escape.js';
import { renderText } from '../../atoms/text/text.template.js';
import { CARD_HEADING_TAGS } from '../card-program/card-program.template.js';

export function renderCardTile({
  title = 'Akredytacja Insights Discovery',
  subtitle = 'Certyfikacja · 3 dni',
  text = 'Uprawnienia do pracy z profilem Insights Discovery w zespołach i w coachingu indywidualnym.',
  href = '#',
  headingTag = 'h3',
} = {}) {
  const tag = CARD_HEADING_TAGS.includes(headingTag) ? headingTag : 'h3';
  const body = [
    `<div class="ds-card-tile__title-box">${renderText({ text: title, variant: '2xl', tag, className: 'ds-card-tile__title' })}</div>`,
    `<div class="ds-card-tile__texts">${subtitle ? renderText({ text: subtitle, variant: 'body', className: 'ds-card-tile__subtitle' }) : ''}${text ? renderText({ text, variant: 'body', className: 'ds-card-tile__text' }) : ''}</div>`,
  ].join('');
  if (href) return `<a class="ds-card-tile" href="${escapeHtml(href)}">${body}</a>`;
  return `<article class="ds-card-tile">${body}</article>`;
}
