// Button family: the main button (arrow or pill shape), the outline pill and the round arrow.
// Figma: Atoms → Button (3:125), Button/Outline (3:130), Button/Arrow (3:137). DCC: .dcc-btn*, .dcc-arrow.
// With href the element is <a>, otherwise <button type="button">. Text args are escaped.
// Arg names follow components/README.md: text, ariaLabel, variant, size, href.
import { escapeHtml } from '../../_shared/escape.js';
import { renderIcon } from '../icon/icon.template.js';

export const BUTTON_VARIANTS = ['primary', 'accent', 'light'];
export const BUTTON_SHAPES = ['arrow', 'pill'];
export const BUTTON_ARROW_VARIANTS = ['default', 'inverted'];

// Disabled: a <button> gets the disabled attribute; a link has no disabled state, so it loses its href and
// gets aria-disabled="true" (role="link" keeps it announced as a link).
function openTag({ href, disabled, classes }) {
  if (href && disabled) return { open: `<a class="${classes}" role="link" aria-disabled="true">`, close: '</a>' };
  if (href) return { open: `<a class="${classes}" href="${escapeHtml(href)}">`, close: '</a>' };
  return { open: `<button type="button" class="${classes}"${disabled ? ' disabled' : ''}>`, close: '</button>' };
}

export function renderButton({ text = 'Poznaj ofertę', href = '', variant = 'primary', shape = 'arrow', disabled = false } = {}) {
  const variantName = BUTTON_VARIANTS.includes(variant) ? variant : 'primary';
  const classes = ['ds-button', `ds-button--${variantName}`, shape === 'pill' ? 'ds-button--pill' : ''].filter(Boolean).join(' ');
  const { open, close } = openTag({ href, disabled, classes });
  const icon = shape === 'pill' ? '' : `<span class="ds-button__icon">${renderIcon({ name: 'arrow-diagonal' })}</span>`;
  return `${open}<span class="ds-button__label">${escapeHtml(text)}</span>${icon}${close}`;
}

// The program card's "Więcej" pill: a 1 px currentColor outline. Inside a card that is itself the link it is a
// <span> (no href); with href it is a link of its own.
export function renderButtonOutline({ text = 'Więcej', href = '' } = {}) {
  if (href) return `<a class="ds-button-outline" href="${escapeHtml(href)}">${escapeHtml(text)}</a>`;
  return `<span class="ds-button-outline">${escapeHtml(text)}</span>`;
}

// The round accent arrow. Without href it is decorative (the card's link carries the name); with href it is a
// link named by `ariaLabel`. Variant inverted: its at-rest look inside the program card.
export function renderButtonArrow({ href = '', ariaLabel = 'Czytaj dalej', variant = 'default' } = {}) {
  const classes = ['ds-button-arrow', variant === 'inverted' ? 'ds-button-arrow--inverted' : ''].filter(Boolean).join(' ');
  const icon = renderIcon({ name: 'arrow-diagonal' });
  if (href) return `<a class="${classes}" href="${escapeHtml(href)}" aria-label="${escapeHtml(ariaLabel)}">${icon}</a>`;
  return `<span class="${classes}" aria-hidden="true">${icon}</span>`;
}
