// Card/Industry step: one industry of the industry carousel. Figma: Molecules → Card/Industry step (22:266).
// DCC: blocks/karty (.dcc-karty--branza). A centred card over the number circle on a timeline; active (the centred
// slide, set by the carousel) is taller and blue with an accent number. Composes Text and the Letter circle atom.
import { escapeHtml } from '../../_shared/escape.js';
import { renderLetterCircle } from '../../atoms/number/number.template.js';
import { renderText } from '../../atoms/text/text.template.js';
import { CARD_HEADING_TAGS } from '../card-program/card-program.template.js';

const labelled = (label, text, className) =>
  text ? `<p class="${className}">${label ? `<strong>${escapeHtml(label)}</strong> ` : ''}${escapeHtml(text)}</p>` : '';

export function renderCardIndustryStep({
  number = '01',
  title = 'Logistyka / magazyny / dystrybucja',
  challengeLabel = 'Wyzwanie:',
  challenge = 'napięcia między obszarami, brak spójnej współpracy przy dużej presji wyniku.',
  actionLabel = 'Działanie:',
  action = 'porządkujemy komunikację, role i odpowiedzialność, żeby zespół działał jako całość.',
  active = false,
  headingTag = 'h3',
} = {}) {
  const tag = CARD_HEADING_TAGS.includes(headingTag) ? headingTag : 'h3';
  const card = [
    renderText({ text: title, variant: '2xl', tag, className: 'ds-card-industry-step__title' }),
    labelled(challengeLabel, challenge, 'ds-card-industry-step__challenge'),
    labelled(actionLabel, action, 'ds-card-industry-step__action'),
  ].join('');
  return `<article class="ds-card-industry-step${active ? ' is-active' : ''}"><div class="ds-card-industry-step__card">${card}</div><div class="ds-card-industry-step__number">${renderLetterCircle({ text: number, variant: 'industry', active })}</div></article>`;
}
