import { LABEL_VARIANTS, renderLabel } from './label.template.js';

export default {
  title: 'Atoms/Label',
  render: (args) => `<div style="padding: var(--space-24)">${renderLabel(args)}</div>`,
  argTypes: {
    text: { control: 'text' },
    variant: { control: 'inline-radio', options: LABEL_VARIANTS, description: 'Figma Variant: Accent, Primary, Inverse.' },
  },
  args: { text: 'Polecane', variant: 'accent' },
  parameters: {
    docs: { description: { component: '`.ds-label ds-label--{accent|primary|inverse}` (.dcc-odznaka). Static, no states.' } },
  },
};

export const Accent = {};
export const Primary = { args: { variant: 'primary', text: 'Akcja' } };
export const Inverse = { args: { variant: 'inverse', text: 'Promocja' } };
