import { FIELD_TYPES, renderCheckbox, renderFormField, renderNewsletterField, renderQuantityStepper } from './form-field.template.js';

const frame = (markup, width = 'var(--size-card-width)') => `<div style="padding: var(--space-24); max-width: ${width}">${markup}</div>`;
const FOCUS = { pseudo: { focus: ['.ds-field__control'], focusVisible: ['.ds-field__control'] } };
const MOBILE = { viewport: { value: 'mobile', isRotated: false } };
const COUNTRIES = [
  { value: 'pl', text: 'Polska' },
  { value: 'de', text: 'Niemcy' },
];
const SAMPLE = {
  text: { label: 'Adres e-mail', type: 'email', value: 'anna@firma.pl' },
  select: { label: 'Kraj', type: 'select', value: 'pl', options: COUNTRIES },
  textarea: { label: 'Wiadomość', type: 'textarea', value: 'Dzień dobry, chciałbym zapytać o szkolenie dla zespołu sprzedaży.' },
};
const ERROR = 'Podaj poprawny adres e-mail.';

// Figma Field: Type × State (Default = empty, Filled = a value, Focus, Error).
function field(kind, state) {
  const { value, ...rest } = SAMPLE[kind];
  const args = { ...rest, id: `story-${kind}-${state}`, name: kind, value: state === 'default' ? '' : value };
  if (state === 'error') args.error = ERROR;
  return state === 'focus' ? { args, globals: FOCUS } : { args };
}

export default {
  title: 'Atoms/Form Field',
  render: (args) => frame(renderFormField(args)),
  argTypes: {
    type: { control: 'select', options: FIELD_TYPES, description: 'Figma Type: Text (text/email/tel), Select, Textarea, Search.' },
    label: { control: 'text', description: 'Text of the visible floating `<label>` (not used by search).' },
    placeholder: { control: 'text', description: 'search only: the visible placeholder.' },
    ariaLabel: { control: 'text', description: 'search only: accessible name (default: the placeholder).' },
    name: { control: 'text' },
    id: { control: 'text' },
    value: { control: 'text', description: 'Empty = Figma State=Default; a value = Filled.' },
    options: { control: 'object', description: 'select only: `[{ value, text }]`.' },
    error: { control: 'text', description: 'Figma State=Error: sets aria-invalid and the message.' },
    required: { control: 'boolean' },
  },
  args: { type: 'email', label: 'Adres e-mail', placeholder: 'Szukaj', ariaLabel: '', name: 'email', id: 'story-field', value: '', options: [], error: '', required: false },
  parameters: {
    docs: {
      description: {
        component:
          '`.ds-field ds-field--{text|select|textarea|search}` > `.ds-field__box` > `.ds-field__control` + `label.ds-field__label`; `.ds-field__message` under an invalid field. Also `.ds-checkbox`, `.ds-newsletter-field` and `.ds-quantity`.',
      },
    },
  },
};

export const Text = field('text', 'default');
export const TextFilled = field('text', 'filled');
export const TextFocus = field('text', 'focus');
export const TextError = field('text', 'error');
export const Select = field('select', 'default');
export const SelectFilled = field('select', 'filled');
export const SelectFocus = field('select', 'focus');
export const SelectError = field('select', 'error');
export const Textarea = field('textarea', 'default');
export const TextareaFilled = field('textarea', 'filled');
export const TextareaFocus = field('textarea', 'focus');
export const TextareaError = field('textarea', 'error');
export const Search = { args: { type: 'search', placeholder: 'Szukaj na blogu', name: 's', id: 'story-search' } };
export const SearchFocus = { ...Search, globals: FOCUS };

// Figma Checkbox: Checked Off/On × Default/Focus.
const checkbox = (checked, focus) => ({
  render: () => frame(renderCheckbox({ checked, id: `story-checkbox-${checked}-${focus}` }), 'none'),
  ...(focus ? { globals: { pseudo: { focusVisible: ['.ds-checkbox__input'] } } } : {}),
});
export const Checkbox = checkbox(false, false);
export const CheckboxFocus = checkbox(false, true);
export const CheckboxChecked = checkbox(true, false);
export const CheckboxCheckedFocus = checkbox(true, true);

// Figma Newsletter field: Desktop, Mobile (the 390 viewport). It sits on the brand panel in the footer.
const newsletter = (markup) => `<div style="padding: var(--space-24); background: var(--color-surface-brand)">${markup}</div>`;
export const NewsletterField = { render: () => newsletter(renderNewsletterField()) };
export const NewsletterFieldMobile = { ...NewsletterField, globals: MOBILE };

export const QuantityStepper = { render: () => frame(renderQuantityStepper(), 'none') };
