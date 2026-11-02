// Card/Contact: a contact info card. Figma: Molecules → Card/Contact (130:463, Figma Kind Text / Social = variant). DCC: blocks/kontakt.
// A small accent overline and one or two large values (each may be a link: tel:, mailto:); Social shows the Social row
// (raised) instead of the second value. Composes Text, Link (list: no underline, inherits the value type) and Social row.
import { escapeHtml } from '../../_shared/escape.js';
import { renderLink } from '../../atoms/link/link.template.js';
import { renderText } from '../../atoms/text/text.template.js';
import { renderSocialRow } from '../social-row/social-row.template.js';

export const CARD_CONTACT_VARIANTS = ['text', 'social'];

export function renderCardContact({
  variant = 'text',
  overline = 'Adres',
  values = [{ text: 'ul. 5 Lipca 30/4' }, { text: '70-376 Szczecin' }],
  socialItems,
} = {}) {
  const variantName = CARD_CONTACT_VARIANTS.includes(variant) ? variant : 'text';
  const shown = variantName === 'social' ? values.slice(0, 1) : values.slice(0, 2);
  const valueMarkup = shown
    .map((value) => `<p class="ds-card-contact__value">${value.href ? renderLink({ text: value.text, href: value.href, variant: 'list' }) : escapeHtml(value.text)}</p>`)
    .join('');
  const social = variantName === 'social' ? renderSocialRow({ variant: 'raised', ...(socialItems ? { items: socialItems } : {}) }) : '';
  return `<div class="ds-card-contact ds-card-contact--${variantName}">${renderText({ text: overline, variant: 'small', className: 'ds-card-contact__overline' })}${valueMarkup}${social}</div>`;
}
