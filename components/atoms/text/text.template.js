// Text styles. Figma: Atoms → Text (4:81). `variant` is the type style; `tag` sets the HTML level (a section title
// can be an h2 with the 4xl look). Sizes are fluid tokens: desktop → mobile in one class.
// Colour: inherited from the surface by default (tone "inherit"), so the same text works on the page, a blue card
// or Dark; `tone` picks a text colour token where the design uses one.
import { escapeHtml } from '../../_shared/escape.js';

export const TEXT_VARIANTS = ['4xl', '3xl', '2xl', '2xl-medium', 'xl', 'lg', 'lead-large', 'body', 'body-bold', 'small', 'overline', 'number', 'button', 'question'];
export const TEXT_TONES = ['inherit', 'default', 'muted', 'primary', 'accent', 'on-brand'];
export const TEXT_TAGS = ['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

// `strong`: an optional bold closing sentence after the text (a lead ending in bold, Figma Heading group).
// `className`: extra classes from the molecule that places the text (e.g. ds-heading-group__title).
// `mobile`: another variant used below 782 px (ds-text--mobile-{variant}), e.g. a 4XL title that reads 3XL on phones.
export function renderText({ text = 'Zażółć gęślą jaźń', strong = '', variant = 'body', mobile = '', tone = 'inherit', tag = 'p', className = '' } = {}) {
  const variantName = TEXT_VARIANTS.includes(variant) ? variant : 'body';
  const mobileClass = TEXT_VARIANTS.includes(mobile) && mobile !== variantName ? ` ds-text--mobile-${mobile}` : '';
  const toneClass = TEXT_TONES.includes(tone) && tone !== 'inherit' ? ` ds-text--${tone}` : '';
  const extraClass = className ? ` ${escapeHtml(className)}` : '';
  const tagName = TEXT_TAGS.includes(tag) ? tag : 'p';
  const closing = strong ? `${text ? ' ' : ''}<strong>${escapeHtml(strong)}</strong>` : '';
  return `<${tagName} class="ds-text ds-text--${variantName}${mobileClass}${toneClass}${extraClass}">${escapeHtml(text)}${closing}</${tagName}>`;
}
