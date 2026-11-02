// Inline SVG icons. Strokes use currentColor, so the parent sets the colour; .ds-icon sets the 24 px box
// (a parent such as .ds-button__icon overrides the size). Decorative: aria-hidden, the parent carries the label.
// Paths: Figma Atoms → Icons (3:138); the arrow is dcc_arrow_svg() redrawn on the 24 px grid.

export const ICON_PATHS = {
  'arrow-diagonal': ['M7 17 17 7M17 15V7H9'],
  'chevron-left': ['M20 12H4M10 18 4 12 10 6'],
  'chevron-right': ['M4 12H20M14 18 20 12 14 6'],
  plus: ['M6 12H18', 'M12 6V18'],
  minus: ['M6 12H18'],
};

export const ICON_NAMES = Object.keys(ICON_PATHS);

// Round caps and joins for the arrows; the plus/minus bars are square-ended (Figma: 12 × 1.6 rectangles).
const STROKES = {
  'arrow-diagonal': 'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"',
  'chevron-left': 'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"',
  'chevron-right': 'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"',
  plus: 'stroke-width="1.6"',
  minus: 'stroke-width="1.6"',
};

export function renderIcon({ name = 'arrow-diagonal', className = '' } = {}) {
  const paths = ICON_PATHS[name] ?? ICON_PATHS['arrow-diagonal'];
  const iconName = ICON_PATHS[name] ? name : 'arrow-diagonal';
  const classes = ['ds-icon', `ds-icon--${iconName}`, className].filter(Boolean).join(' ');
  const pathMarkup = paths.map((path) => `<path d="${path}"/>`).join('');
  return `<svg class="${classes}" viewBox="0 0 24 24" fill="none" stroke="currentColor" ${STROKES[iconName]} aria-hidden="true" focusable="false">${pathMarkup}</svg>`;
}
