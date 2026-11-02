import { OVERVIEW_STATE, STATE_ARG_TYPES, forceState, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { FIELD_TYPES, renderCheckbox, renderFormField, renderNewsletterField, renderQuantityStepper } from './form-field.template.js';

const frame = (markup, width = 'var(--size-card-width)') => `<div style="padding: var(--space-24); max-width: ${width}">${markup}</div>`;
const CONTROL = ['.ds-field__control'];
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
    ...STATE_ARG_TYPES,
  },
  args: { type: 'email', label: 'Adres e-mail', placeholder: 'Szukaj', ariaLabel: '', name: 'email', id: 'story-field', value: '', options: [], error: '', required: false, state: 'default' },
  parameters: {
    stateTargets: CONTROL,
    docs: {
      description: {
        component:
          '`.ds-field ds-field--{text|select|textarea|search}` > `.ds-field__box` > `.ds-field__control` + `label.ds-field__label`; `.ds-field__message` under an invalid field. Also `.ds-checkbox`, `.ds-newsletter-field` and `.ds-quantity` (see the Overview). The Mobile newsletter field is the Mobile 390 viewport.',
      },
    },
  },
};

export const Playground = {};

// Figma Field: Type × State (Default = empty, Filled = a value, Focus, Error).
const field = (kind, state) => {
  const { value, ...rest } = SAMPLE[kind];
  const args = { ...rest, id: `overview-${kind}-${state}`, name: `${kind}-${state}`, value: state === 'default' || state === 'focus' ? '' : value };
  if (state === 'error') args.error = ERROR;
  return overviewCell(`${kind} · ${state}`, frame(forceState(renderFormField(args), state === 'focus' ? 'focus' : 'default', CONTROL)));
};

// Figma Checkbox: Checked Off/On × Default/Focus.
const checkbox = (checked, focus) =>
  overviewCell(
    `checkbox · ${checked ? 'checked' : 'unchecked'}${focus ? ' · focus' : ''}`,
    frame(forceState(renderCheckbox({ checked, id: `overview-checkbox-${checked}-${focus}` }), focus ? 'focus' : 'default', ['.ds-checkbox__input']), 'none'),
  );

// The newsletter field sits on the brand panel in the footer.
const newsletter = (markup) => `<div style="padding: var(--space-24); background: var(--color-surface-brand)">${markup}</div>`;

export const Overview = {
  ...OVERVIEW_STATE,
  render: () =>
    overviewGrid(
      [
        ...['text', 'select', 'textarea'].flatMap((kind) => ['default', 'filled', 'focus', 'error'].map((state) => field(kind, state))),
        overviewCell('search · default', frame(renderFormField({ type: 'search', placeholder: 'Szukaj na blogu', name: 's', id: 'overview-search' }))),
        overviewCell(
          'search · focus',
          frame(forceState(renderFormField({ type: 'search', placeholder: 'Szukaj na blogu', name: 's', id: 'overview-search-focus' }), 'focus', CONTROL)),
        ),
        checkbox(false, false),
        checkbox(false, true),
        checkbox(true, false),
        checkbox(true, true),
        overviewCell('newsletter field', newsletter(renderNewsletterField())),
        overviewCell('quantity stepper', frame(renderQuantityStepper(), 'none')),
      ],
      '300px',
    ),
};
