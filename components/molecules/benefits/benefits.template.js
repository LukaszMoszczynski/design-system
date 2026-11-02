// Benefits: a pill title (`chevron`: an optional chevron) over outline pills, one per benefit. Used by Card/Recommendation
// and Card/Training (Featured). DCC: .dcc-program__benefits-title / .dcc-program__benefits (blocks/programy).
// Composes the Icon (chevron) and Tag (outline) atoms. Variant on-brand: for a blue card (accent title pill, white pill
// borders, pills flowing in rows).
import { escapeHtml } from '../../_shared/escape.js';
import { renderIcon } from '../../atoms/icon/icon.template.js';
import { renderTag } from '../../atoms/tag/tag.template.js';

export const BENEFITS_VARIANTS = ['default', 'on-brand'];

export function renderBenefits({
  title = '3 główne korzyści',
  items = ['jasność co do swojej roli i autonomii', 'odzyskana równowaga i energia', 'przestrzeń do rozmowy i wsparcia'],
  chevron = false,
  variant = 'default',
} = {}) {
  const variantName = BENEFITS_VARIANTS.includes(variant) ? variant : 'default';
  const titleMarkup = title ? `<p class="ds-benefits__title">${escapeHtml(title)}${chevron ? renderIcon({ name: 'chevron-right' }) : ''}</p>` : '';
  const list = items.length ? `<ul class="ds-benefits__list" role="list">${items.map((text) => renderTag({ text, variant: 'outline', tag: 'li' })).join('')}</ul>` : '';
  return `<div class="ds-benefits ds-benefits--${variantName}">${titleMarkup}${list}</div>`;
}
