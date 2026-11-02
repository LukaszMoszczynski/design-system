// Text styles. Figma: Atoms → Text (4:81). Pick the style for the look; the tag sets the HTML level
// (a section title can be an h2 with the 4xl look). Sizes are fluid tokens: desktop → mobile in one class.
import { escapeHtml } from '../../_shared/escape.js';

export const TEXT_STYLES = ['4xl', '3xl', '2xl', 'xl', 'lg', 'body', 'body-bold', 'small', 'overline', 'number', 'button', 'question'];
export const TEXT_TAGS = ['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

export function renderText({ text = 'Zażółć gęślą jaźń', style = 'body', tag = 'p' } = {}) {
  const styleName = TEXT_STYLES.includes(style) ? style : 'body';
  const tagName = TEXT_TAGS.includes(tag) ? tag : 'p';
  return `<${tagName} class="ds-text ds-text--${styleName}">${escapeHtml(text)}</${tagName}>`;
}
