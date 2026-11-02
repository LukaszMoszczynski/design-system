// Form controls. Figma: Atoms → Form fields (90:135 Field, 90:152 Checkbox, 90:163 Newsletter field, 90:164 Quantity stepper).
// DCC: the checkout and contact fields (components/koszyk-strona.css), .dcc-footer__newsletter form, .dcc-buy__qty.
// Pure CSS: the label floats with :placeholder-shown / :focus, errors come from aria-invalid. The stepper's +/- and the
// newsletter submit are wired by the organisms that use them (data- hooks below).
import { escapeHtml } from '../../_shared/escape.js';
import { renderIcon } from '../icon/icon.template.js';

export const FIELD_TYPES = ['text', 'email', 'tel', 'select', 'textarea', 'search'];

const SEARCH_ICON =
  '<svg class="ds-field__search-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><path d="M15 8.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"/><path d="m13.5 13.5 5 5" stroke-linecap="round"/></svg>';

// One field: a box with the control and its label (floating), plus the error message below when `error` is set.
// select: `options` [{ value, label }]; an empty first option keeps the label at rest until a value is chosen.
export function renderFormField({
  type = 'text',
  label = 'Adres e-mail',
  name = 'email',
  id = '',
  value = '',
  options = [],
  error = '',
  required = false,
} = {}) {
  const typeName = FIELD_TYPES.includes(type) ? type : 'text';
  const fieldId = escapeHtml(id || `ds-field-${name}`);
  const messageId = `${fieldId}-message`;
  const common = `class="ds-field__control" id="${fieldId}" name="${escapeHtml(name)}"${required ? ' required' : ''}${error ? ` aria-invalid="true" aria-describedby="${messageId}"` : ''}`;
  const kind = typeName === 'select' || typeName === 'textarea' || typeName === 'search' ? typeName : 'text';

  if (typeName === 'search') {
    return `<div class="ds-field ds-field--search"><div class="ds-field__box">${SEARCH_ICON}<input type="search" ${common} value="${escapeHtml(value)}" placeholder="${escapeHtml(label)}" aria-label="${escapeHtml(label)}"></div></div>`;
  }

  let control;
  if (typeName === 'select') {
    const items = [{ value: '', label: '' }, ...options]
      .map((option) => `<option value="${escapeHtml(option.value)}"${String(option.value) === String(value) ? ' selected' : ''}>${escapeHtml(option.label)}</option>`)
      .join('');
    control = `<select ${common}>${items}</select>`;
  } else if (typeName === 'textarea') {
    control = `<textarea ${common} placeholder=" ">${escapeHtml(value)}</textarea>`;
  } else {
    control = `<input type="${typeName}" ${common} value="${escapeHtml(value)}" placeholder=" ">`;
  }
  const chevron = typeName === 'select' ? `<span class="ds-field__chevron">${renderIcon({ name: 'chevron-right' })}</span>` : '';
  const message = error ? `<p class="ds-field__message" id="${messageId}">${escapeHtml(error)}</p>` : '';
  return `<div class="ds-field ds-field--${kind}"><div class="ds-field__box">${control}<label class="ds-field__label" for="${fieldId}">${escapeHtml(label)}</label>${chevron}</div>${message}</div>`;
}

// Consent checkbox: a native input drawn as a 20 px box. Legal links inside the label take the primary colour.
export function renderCheckbox({ label = 'Akceptuję regulamin i politykę prywatności', name = 'terms', id = '', checked = false, required = false } = {}) {
  const fieldId = escapeHtml(id || `ds-checkbox-${name}`);
  return `<div class="ds-checkbox"><input type="checkbox" class="ds-checkbox__input" id="${fieldId}" name="${escapeHtml(name)}"${checked ? ' checked' : ''}${required ? ' required' : ''}><label class="ds-checkbox__label" for="${fieldId}">${escapeHtml(label)}</label></div>`;
}

// Footer newsletter: a pill e-mail input and a round submit with an arrow. Place it inside the organism's <form>.
export function renderNewsletterField({ placeholder = 'Wpisz swój e-mail', name = 'email', label = 'Adres e-mail do newslettera', submitLabel = 'Zapisz się' } = {}) {
  return `<div class="ds-newsletter-field"><input type="email" class="ds-newsletter-field__input" name="${escapeHtml(name)}" placeholder="${escapeHtml(placeholder)}" aria-label="${escapeHtml(label)}" autocomplete="email" required><button type="submit" class="ds-newsletter-field__submit" aria-label="${escapeHtml(submitLabel)}">${renderIcon({ name: 'chevron-right' })}</button></div>`;
}

// Quantity stepper: minus, the typed quantity, plus (the buy box wires the buttons).
export function renderQuantityStepper({ value = 1, min = 1, max = 99, name = 'quantity', label = 'Liczba' } = {}) {
  return `<div class="ds-quantity" data-ds-quantity><button type="button" class="ds-quantity__button" data-ds-quantity-minus aria-label="Mniej">−</button><input type="number" class="ds-quantity__input" name="${escapeHtml(name)}" value="${escapeHtml(value)}" min="${escapeHtml(min)}" max="${escapeHtml(max)}" inputmode="numeric" aria-label="${escapeHtml(label)}"><button type="button" class="ds-quantity__button" data-ds-quantity-plus aria-label="Więcej">+</button></div>`;
}
