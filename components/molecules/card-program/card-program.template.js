// Card/Program: the bestseller program card. Figma: Molecules → Card/Program (8:113). DCC: blocks/karty
// (.dcc-karty--program .dcc-karta). With href the whole card is one link (one focus ring); its "Więcej" pill and the
// round arrow are then decorative spans (Button outline and Button arrow atoms without href).
// Composes Text (title 2XL, subtitle, description), Button outline and Button arrow (inverted at rest).
import { escapeHtml } from '../../_shared/escape.js';
import { renderButtonArrow, renderButtonOutline } from '../../atoms/button/button.template.js';
import { renderText } from '../../atoms/text/text.template.js';

export const CARD_HEADING_TAGS = ['h2', 'h3', 'h4'];

export function renderCardProgram({
  title = 'Negocjacje handlowe',
  subtitle = 'Szkolenie otwarte · 2 dni',
  text = 'Praktyczny warsztat dla handlowców i kupców: przygotowanie, prowadzenie i domykanie trudnych negocjacji.',
  moreText = 'Więcej',
  href = '#',
  headingTag = 'h3',
} = {}) {
  const tag = CARD_HEADING_TAGS.includes(headingTag) ? headingTag : 'h3';
  const body = [
    `<div class="ds-card-program__title-box">${renderText({ text: title, variant: '2xl', tag, className: 'ds-card-program__title' })}</div>`,
    `<div class="ds-card-program__texts">${subtitle ? renderText({ text: subtitle, variant: 'body', className: 'ds-card-program__subtitle' }) : ''}${text ? renderText({ text, variant: 'body', className: 'ds-card-program__text' }) : ''}</div>`,
    `<div class="ds-card-program__footer">${renderButtonOutline({ text: moreText })}${renderButtonArrow({ variant: 'inverted' })}</div>`,
  ].join('');
  if (href) return `<a class="ds-card-program" href="${escapeHtml(href)}">${body}</a>`;
  return `<article class="ds-card-program">${body}</article>`;
}
