import { OVERVIEW_STATE, STATE_ARG_TYPES, forceState, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { DEFAULT_FACTS, DEFAULT_TERMS, renderBuyBox } from './buy-box.template.js';
// Importing the script registers window.DS.buyBox; the global decorator calls init(wrapper) after every render.
import './buy-box.js';

const frame = (markup) => `<div style="padding: var(--space-24) var(--space-gutter)">${markup}</div>`;
const CONTROLS = ['.ds-buy-box__mode[aria-pressed="false"]', '.ds-quantity__button', '.ds-buy-box .ds-button'];

export default {
  title: 'Organisms/Buy Box',
  render: (args) => frame(renderBuyBox(args)),
  argTypes: {
    gross: { control: 'number', description: 'Unit price brutto (zł).' },
    net: { control: 'number', description: 'Unit price netto (zł).' },
    terms: { control: 'object', description: 'The term select options [{ value, text }].' },
    term: { control: 'text', description: 'The selected term value.' },
    termLabel: { control: 'text' },
    quantityLabel: { control: 'text' },
    seats: { control: 'number', description: 'Free seats: the quantity maximum.' },
    facts: { control: 'object', description: '[{ label, value }]' },
    buttonText: { control: 'text' },
    priceModeAriaLabel: { control: 'text', description: 'The brutto / netto switch group name.' },
    action: { control: 'text', description: 'The form action (the cart).' },
    id: { control: 'text', description: 'The form id, also the prefix of the field ids.' },
    ...STATE_ARG_TYPES,
  },
  args: {
    gross: 1490,
    net: 1211.38,
    terms: DEFAULT_TERMS,
    term: DEFAULT_TERMS[0].value,
    termLabel: 'Termin',
    quantityLabel: 'Liczba miejsc',
    seats: 20,
    facts: DEFAULT_FACTS,
    buttonText: 'Dodaj do koszyka',
    priceModeAriaLabel: 'Pokaż cenę',
    action: '#',
    id: 'ds-buy-box',
    state: 'default',
  },
  parameters: {
    stateTargets: CONTROLS,
    // DCC palette gap: white on the accent switch half and the accent submit fail colour contrast (as in Atoms/Button
    // Accent). a11y todo until the palette is decided; tokens unchanged.
    a11y: { test: 'todo' },
    docs: {
      description: {
        component:
          '`form.ds-buy-box[data-ds-buy-box][data-ds-gross][data-ds-net]` > `div.ds-buy-box__price` (`p.ds-buy-box__amount[data-ds-buy-amount]`, `p.ds-buy-box__note[data-ds-buy-note]`, `div.ds-buy-box__modes` with two `button.ds-buy-box__mode[data-ds-price-mode][aria-pressed]`) + the term select (Form field) + `div.ds-buy-box__quantity` (`p.ds-buy-box__label`, Quantity stepper, `p.ds-buy-box__total[data-ds-buy-total]`) + `dl.ds-buy-box__facts > div.ds-buy-box__fact` (`dt`, `dd`) + the Accent submit Button. buy-box.js: the brutto/netto switch and the total. State applies to the netto half, the stepper buttons and the submit.',
      },
    },
  },
};

export const Playground = {};

// Figma Buy box: one variant; at rest and with the controls hovered and focused.
export const Overview = {
  ...OVERVIEW_STATE,
  render: (args) =>
    overviewGrid(
      ['default', 'hover', 'focus'].map((state) => overviewCell(state, forceState(renderBuyBox({ ...args, id: `ds-buy-box-${state}` }), state, CONTROLS))),
      '384px',
    ),
};
