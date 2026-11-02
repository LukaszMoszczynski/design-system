// Label: the small bold pill (.dcc-odznaka). Figma: Atoms → Link · Label → Label (4:56).
// Variant accent (polecane), primary (akcja), inverse (promocja). The shop's Badge pill renders this markup.
import { escapeHtml } from '../../_shared/escape.js';

export const LABEL_VARIANTS = ['accent', 'primary', 'inverse'];

export function renderLabel({ text = 'Polecane', variant = 'accent' } = {}) {
  const variantName = LABEL_VARIANTS.includes(variant) ? variant : 'accent';
  return `<span class="ds-label ds-label--${variantName}">${escapeHtml(text)}</span>`;
}
