// Tag: small static pills. Figma: Atoms → Navigation · Tags · Numbers → Tag (21:135).
// DCC: .dcc-model__pills li / .dcc-osoba__skills li (soft), .dcc-post-card__date (white), .dcc-karta__label (brand).
import { escapeHtml } from '../../_shared/escape.js';

export const TAG_VARIANTS = ['soft', 'white', 'brand', 'outline', 'brand-small', 'article', 'article-white', 'hashtag'];

export function renderTag({ text = 'Przetestowany', variant = 'soft', tag = 'span' } = {}) {
  const variantName = TAG_VARIANTS.includes(variant) ? variant : 'soft';
  const tagName = ['span', 'li', 'time', 'a'].includes(tag) ? tag : 'span';
  return `<${tagName} class="ds-tag ds-tag--${variantName}">${escapeHtml(text)}</${tagName}>`;
}
