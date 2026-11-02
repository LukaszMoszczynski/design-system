// Text links. Figma: Atoms → Link · Label → Link (4:49). DCC: .dcc-karta__links a (inline), .dcc-btn--link (arrow),
// .dcc-karty--obszar .dcc-karta__more (brand), .dcc-footer a (footer).
// Kinds with an arrow: arrow, brand, bold, inverse. Inline and footer are plain text.
import { escapeHtml } from '../../_shared/escape.js';
import { renderIcon } from '../icon/icon.template.js';

export const LINK_KINDS = ['inline', 'arrow', 'brand', 'footer', 'bold', 'inverse'];
const WITH_ARROW = new Set(['arrow', 'brand', 'bold', 'inverse']);

export function renderLink({ text = 'Zobacz szczegóły', href = '#', kind = 'inline' } = {}) {
  const kindName = LINK_KINDS.includes(kind) ? kind : 'inline';
  const arrow = WITH_ARROW.has(kindName) ? renderIcon({ name: 'arrow-diagonal' }) : '';
  const label = arrow ? `<span class="ds-link__label">${escapeHtml(text)}</span>${arrow}` : escapeHtml(text);
  return `<a class="ds-link ds-link--${kindName}" href="${escapeHtml(href)}">${label}</a>`;
}
