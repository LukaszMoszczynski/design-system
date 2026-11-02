import { BADGE_VARIANTS, renderBadgePill } from './badge-pill.template.js';

export default {
  title: 'Atoms/Badge Pill',
  render: (args) => `<div style="padding: var(--space-24); background: var(--color-surface-card)">${renderBadgePill(args)}</div>`,
  argTypes: {
    variant: { control: 'inline-radio', options: Object.keys(BADGE_VARIANTS), description: 'Figma Variant: Polecane, Promocja, Akcja.' },
    text: { control: 'text', description: 'Label; empty = the variant name.' },
  },
  args: { variant: 'polecane', text: '' },
  parameters: {
    docs: {
      description: {
        component: 'Prints the Label atom (`.ds-label ds-label--{accent|inverse|primary}`); CSS is `atoms/label/label.css`.',
      },
    },
  },
};

export const Polecane = {};
export const Promocja = { args: { variant: 'promocja' } };
export const Akcja = { args: { variant: 'akcja' } };
