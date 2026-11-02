// Badge pill: the shop's small pill on product cards and buy boxes. Figma: Atoms → Badge pill (102:70).
// DCC: .dcc-odznaka (components/odznaka.css). It is the Label atom under shop names, so it prints Label markup and
// uses atoms/label/label.css: polecane = accent, promocja = inverse, akcja = primary.
import { renderLabel } from '../label/label.template.js';

export const BADGE_VARIANTS = { polecane: 'accent', promocja: 'inverse', akcja: 'primary' };
const DEFAULT_TEXT = { polecane: 'Polecane', promocja: 'Promocja', akcja: 'Akcja' };

export function renderBadgePill({ variant = 'polecane', text = '' } = {}) {
  const variantName = BADGE_VARIANTS[variant] ? variant : 'polecane';
  return renderLabel({ text: text || DEFAULT_TEXT[variantName], variant: BADGE_VARIANTS[variantName] });
}
