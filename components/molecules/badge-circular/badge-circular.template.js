// Badge/Circular: a 160 px ring with the wording running clockwise round it and an accent dot with an icon.
// Figma: Molecules → Badge/Circular (51:51). DCC: dcc_badge() (inc/helpers.php), .dcc-badge (assets/css/base.css),
// used by blocks/wezwanie (Call to action / Large) and, with the check, the recommendation card corner.
// The wording is an SVG textPath on a 58 px radius (it scales with the badge); the arrow is the Icon atom in the dot,
// the check an inline SVG in currentColor. The badge is an image named by its wording (role="img"); the SVG is hidden.
import { escapeHtml } from '../../_shared/escape.js';
import { renderIcon } from '../../atoms/icon/icon.template.js';

export const BADGE_ICONS = ['arrow', 'check'];
// variant default: card-colour disc, text-colour wording, accent dot; accent: accent disc, on-brand wording, primary dot
// (Figma Text + image / Photos).
export const BADGE_VARIANTS = ['default', 'accent'];

const CHECK =
  '<svg class="ds-icon ds-badge-circular__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12.5 10 17.5 19 7"/></svg>';

let badgeCount = 0;

export function renderBadgeCircular({ text = 'Wyzwanie? Znajdziemy rozwiązanie', icon = 'arrow', variant = 'default', id = '', className = '' } = {}) {
  badgeCount += 1;
  const pathId = escapeHtml(id || `ds-badge-path-${badgeCount}`);
  const wording = escapeHtml(text);
  const variantClass = variant === 'accent' ? 'ds-badge-circular--accent' : '';
  const classes = ['ds-badge-circular', variantClass, className].filter(Boolean).map((name) => escapeHtml(name)).join(' ');
  const ring = `<svg class="ds-badge-circular__ring" viewBox="-80 -80 160 160" aria-hidden="true" focusable="false"><circle class="ds-badge-circular__disc" r="80"/><path id="${pathId}" d="M0,-58 a58,58 0 1,1 -0.1,0" fill="none"/><text class="ds-badge-circular__text"><textPath href="#${pathId}" textLength="358" lengthAdjust="spacing">${wording}</textPath></text></svg>`;
  const glyph = icon === 'check' ? CHECK : renderIcon({ name: 'arrow-diagonal' });
  return `<span class="${classes}" role="img" aria-label="${wording}">${ring}<span class="ds-badge-circular__dot">${glyph}</span></span>`;
}
