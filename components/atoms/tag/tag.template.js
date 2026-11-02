// Tag: small pills. Figma: Atoms → Navigation · Tags · Numbers → Tag (21:135).
// DCC: .dcc-model__pills li / .dcc-osoba__skills li (soft), .dcc-post-card__date (white), .dcc-karta__label (brand).
// Element: href → <a href> (a link tag, e.g. a blog category); datetime → <time datetime> (the post date);
// otherwise `tag` (span, or li inside a list of skills).
import { escapeHtml } from '../../_shared/escape.js';

export const TAG_VARIANTS = ['soft', 'white', 'brand', 'outline', 'brand-small', 'article', 'article-white', 'hashtag'];

export function renderTag({ text = 'Przetestowany', variant = 'soft', href = '', datetime = '', tag = 'span' } = {}) {
  const classes = `ds-tag ds-tag--${TAG_VARIANTS.includes(variant) ? variant : 'soft'}`;
  const content = escapeHtml(text);
  if (href) return `<a class="${classes}" href="${escapeHtml(href)}">${content}</a>`;
  if (datetime) return `<time class="${classes}" datetime="${escapeHtml(datetime)}">${content}</time>`;
  const tagName = tag === 'li' ? 'li' : 'span';
  return `<${tagName} class="${classes}">${content}</${tagName}>`;
}
