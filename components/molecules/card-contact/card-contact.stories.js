import { overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { CARD_CONTACT_KINDS, renderCardContact } from './card-contact.template.js';

const card = (markup) => `<div style="width: 397px; max-width: 100%">${markup}</div>`;
const frame = (markup) => `<div style="padding: var(--space-24) var(--space-gutter)">${card(markup)}</div>`;

export default {
  title: 'Molecules/Card Contact',
  render: (args) => frame(renderCardContact(args)),
  argTypes: {
    kind: { control: 'inline-radio', options: CARD_CONTACT_KINDS, description: 'Figma Kind: Text (two values), Social (one value and the Social row).' },
    label: { control: 'text', description: 'Shown uppercase.' },
    values: { control: 'object', description: '[{ text, href? }] (href: tel:, mailto: …).' },
    socialItems: { control: 'object', description: 'Social: [{ network, href }]; default LinkedIn, Facebook, Instagram, YouTube.' },
  },
  args: { kind: 'text', label: 'Adres', values: [{ text: 'ul. 5 Lipca 30/4' }, { text: '70-376 Szczecin' }] },
  parameters: {
    docs: {
      description: {
        component:
          '`div.ds-card-contact ds-card-contact--{text|social}` > `p.ds-card-contact__label` (Text small) + `p.ds-card-contact__value` (plain or a Link list) + the raised Social row. Figma Viewport=Mobile: the Mobile 390 viewport.',
      },
    },
    // The label is accent text on the soft card (the DCC palette gap; see Atoms/Button).
    a11y: { test: 'todo' },
  },
};

export const Playground = {};

// Figma Card/Contact: Kind Text, Social, and values as links.
export const Overview = {
  render: () =>
    overviewGrid(
      [
        overviewCell('text', card(renderCardContact({}))),
        overviewCell('social', card(renderCardContact({ kind: 'social', label: 'Adres', values: [{ text: 'ul. 5 Lipca 30/4' }] }))),
        overviewCell('links', card(renderCardContact({ label: 'Kontakt', values: [{ text: '+48 600 000 000', href: 'tel:+48600000000' }, { text: 'biuro@dcc.pl', href: 'mailto:biuro@dcc.pl' }] }))),
      ],
      '397px',
    ),
};
