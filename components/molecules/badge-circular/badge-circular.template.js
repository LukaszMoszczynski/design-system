// Badge/Circular: a 160 px ring with the wording running clockwise round it and an accent dot with the diagonal arrow.
// Figma: Molecules → Badge/Circular (51:51). DCC: dcc_badge() (inc/helpers.php), .dcc-badge (assets/css/base.css),
// used by blocks/wezwanie (Call to action / Large) and the program card's bestseller corner.
// The wording is an SVG textPath on a 58 px radius; the arrow is the Icon atom in the dot. The badge is an image
// named by its wording (role="img"); the SVG is hidden from assistive tech.
import { escapeHtml } from '../../_shared/escape.js';
import { renderIcon } from '../../atoms/icon/icon.template.js';

let badgeCount = 0;

export function renderBadgeCircular({ text = 'Wyzwanie? Znajdziemy rozwiązanie', id = '' } = {}) {
  badgeCount += 1;
  const pathId = escapeHtml(id || `ds-badge-path-${badgeCount}`);
  const wording = escapeHtml(text);
  const ring = `<svg class="ds-badge-circular__ring" viewBox="-80 -80 160 160" aria-hidden="true" focusable="false"><circle class="ds-badge-circular__disc" r="80"/><path id="${pathId}" d="M0,-58 a58,58 0 1,1 -0.1,0" fill="none"/><text class="ds-badge-circular__text"><textPath href="#${pathId}" textLength="358" lengthAdjust="spacing">${wording}</textPath></text></svg>`;
  return `<span class="ds-badge-circular" role="img" aria-label="${wording}">${ring}<span class="ds-badge-circular__dot">${renderIcon({ name: 'arrow-diagonal' })}</span></span>`;
}
