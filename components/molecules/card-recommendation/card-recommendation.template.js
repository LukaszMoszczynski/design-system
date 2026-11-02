// Card/Recommendation: "when we recommend this program". Figma: Molecules → Card/Recommendation (25:388, Tone Default /
// Blue = variant). DCC: blocks/programy (.dcc-program--wyrozniony .dcc-program__card, .is-blue). Not a link.
// Composes Text (title), Badge/Circular (check), the Check item list and the Benefits molecule.
import { CARD_HEADING_TAGS } from '../../_shared/heading-tags.js';
import { renderText } from '../../atoms/text/text.template.js';
import { renderBadgeCircular } from '../badge-circular/badge-circular.template.js';
import { renderBenefits } from '../benefits/benefits.template.js';
import { renderCheckList } from '../check-item/check-item.template.js';

export const CARD_RECOMMENDATION_VARIANTS = ['default', 'blue'];

export function renderCardRecommendation({
  title = 'Szczególnie polecamy, gdy:',
  badgeText = 'Ten program szczególnie polecamy',
  reasons = [
    'szef czuje się przeciążony i zagubiony w operacyjnym chaosie',
    'top lider odpowiada w firmie „za wszystko”',
    'występują stany obniżenia poczucia równowagi, autonomii i poziomu energii',
  ],
  benefitsTitle = '3 główne korzyści',
  benefits = ['jasność co do swojej roli i autonomii', 'odzyskana równowaga i energia', 'przestrzeń do rozmowy i wsparcia'],
  variant = 'default',
  headingTag = 'h3',
} = {}) {
  const variantName = CARD_RECOMMENDATION_VARIANTS.includes(variant) ? variant : 'default';
  const onBrand = variantName === 'blue';
  const tag = CARD_HEADING_TAGS.includes(headingTag) ? headingTag : 'h3';
  const parts = [
    `<div class="ds-card-recommendation__tab">${renderText({ text: title, variant: '2xl', tag, className: 'ds-card-recommendation__title' })}</div>`,
    badgeText ? renderBadgeCircular({ text: badgeText, icon: 'check', className: 'ds-card-recommendation__badge' }) : '',
    reasons.length ? `<div class="ds-card-recommendation__reasons">${renderCheckList({ items: reasons, tone: onBrand ? 'on-brand' : 'default' })}</div>` : '',
    benefitsTitle || benefits.length ? renderBenefits({ title: benefitsTitle, items: benefits, chevron: true, variant: onBrand ? 'on-brand' : 'default' }) : '',
  ];
  return `<article class="ds-card-recommendation ds-card-recommendation--${variantName}">${parts.join('')}</article>`;
}
