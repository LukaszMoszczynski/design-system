// Text links. Figma: Atoms → Link · Label → Link (4:49). DCC: .dcc-karta__links a (list), .dcc-btn--link (arrow),
// .dcc-karty--obszar .dcc-karta__more (brand), .dcc-footer a (footer).
// Variants with an arrow: arrow, brand, bold, inverse. Inline (running text, underlined), list and footer are plain text.
import { escapeHtml } from '../../_shared/escape.js';
import { renderIcon } from '../icon/icon.template.js';

export const LINK_VARIANTS = ['inline', 'list', 'arrow', 'brand', 'footer', 'bold', 'inverse'];
const WITH_ARROW = new Set(['arrow', 'brand', 'bold', 'inverse']);

// uppercase: the text in capitals (Figma Text + image / Panorama, Call to action / Image).
export function renderLink({ text = 'Zobacz szczegóły', href = '#', variant = 'inline', uppercase = false } = {}) {
  const variantName = LINK_VARIANTS.includes(variant) ? variant : 'inline';
  const classes = `ds-link ds-link--${variantName}${uppercase ? ' ds-link--uppercase' : ''}`;
  const arrow = WITH_ARROW.has(variantName) ? renderIcon({ name: 'arrow-diagonal' }) : '';
  const content = arrow ? `<span class="ds-link__label">${escapeHtml(text)}</span>${arrow}` : escapeHtml(text);
  // Without href: a span with the same look, for the visual link inside a card that is itself the link.
  if (!href) return `<span class="${classes}">${content}</span>`;
  return `<a class="${classes}" href="${escapeHtml(href)}">${content}</a>`;
}
