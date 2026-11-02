// Card/Recommendation: "when we recommend this program". Figma: Molecules → Card/Recommendation (25:388, Tone Default /
// Blue). DCC: blocks/programy (.dcc-program--wyrozniony .dcc-program__card, .is-blue). Not a link.
// Composes Text (title), Badge/Circular (check), Check item list, Icon (chevron) and Tag (outline, the benefits).
import { escapeHtml } from '../../_shared/escape.js';
import { renderIcon } from '../../atoms/icon/icon.template.js';
import { renderTag } from '../../atoms/tag/tag.template.js';
import { renderText } from '../../atoms/text/text.template.js';
import { renderBadgeCircular } from '../badge-circular/badge-circular.template.js';
import { CARD_HEADING_TAGS } from '../card-program/card-program.template.js';
import { renderCheckList } from '../check-item/check-item.template.js';

export const CARD_RECOMMENDATION_TONES = ['default', 'blue'];

export function renderCardRecommendation({
  title = 'Szczególnie polecamy, gdy:',
  badgeText = 'Ten program szczególnie polecamy',
  reasons = [
    'szef czuje się przeciążony i zagubiony w operacyjnym chaosie',
    'top lider odpowiada w firmie „za wszystko”',
    'występują stany obniżenia poczucia równowagi, autonomii i poziomu energii',
  ],
  benefitsLabel = '3 główne korzyści',
  benefits = ['jasność co do swojej roli i autonomii', 'odzyskana równowaga i energia', 'przestrzeń do rozmowy i wsparcia'],
  tone = 'default',
  headingTag = 'h3',
} = {}) {
  const toneName = CARD_RECOMMENDATION_TONES.includes(tone) ? tone : 'default';
  const tag = CARD_HEADING_TAGS.includes(headingTag) ? headingTag : 'h3';
  const parts = [
    `<div class="ds-card-recommendation__tab">${renderText({ text: title, variant: '2xl', tag, className: 'ds-card-recommendation__title' })}</div>`,
    badgeText ? renderBadgeCircular({ text: badgeText, icon: 'check', className: 'ds-card-recommendation__badge' }) : '',
    reasons.length ? `<div class="ds-card-recommendation__reasons">${renderCheckList({ items: reasons, tone: toneName === 'blue' ? 'on-brand' : 'default' })}</div>` : '',
    benefitsLabel ? `<p class="ds-card-recommendation__benefits-title">${escapeHtml(benefitsLabel)}${renderIcon({ name: 'chevron-right' })}</p>` : '',
    benefits.length ? `<ul class="ds-card-recommendation__benefits" role="list">${benefits.map((text) => renderTag({ text, variant: 'outline', tag: 'li' })).join('')}</ul>` : '',
  ];
  return `<article class="ds-card-recommendation ds-card-recommendation--${toneName}">${parts.join('')}</article>`;
}
