// Text styles. Figma: Atoms → Text (4:81). `variant` is the type style; `tag` sets the HTML level (a section title
// can be an h2 with the 4xl look). Sizes are fluid tokens: desktop → mobile in one class.
// Colour: inherited from the surface by default (tone "inherit"), so the same text works on the page, a blue card
// or Dark; `tone` picks a text colour token where the design uses one.
import { escapeHtml } from '../../_shared/escape.js';

export const TEXT_VARIANTS = ['4xl', '3xl', '2xl', 'xl', 'lg', 'body', 'body-bold', 'small', 'overline', 'number', 'button', 'question'];
export const TEXT_TONES = ['inherit', 'default', 'muted', 'primary', 'accent', 'on-brand'];
export const TEXT_TAGS = ['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

export function renderText({ text = 'Zażółć gęślą jaźń', variant = 'body', tone = 'inherit', tag = 'p' } = {}) {
  const variantName = TEXT_VARIANTS.includes(variant) ? variant : 'body';
  const toneClass = TEXT_TONES.includes(tone) && tone !== 'inherit' ? ` ds-text--${tone}` : '';
  const tagName = TEXT_TAGS.includes(tag) ? tag : 'p';
  return `<${tagName} class="ds-text ds-text--${variantName}${toneClass}">${escapeHtml(text)}</${tagName}>`;
}
