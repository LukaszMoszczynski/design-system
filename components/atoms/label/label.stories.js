import { LABEL_VARIANTS, renderLabel } from './label.template.js';

// Known brand contrast gap: the DCC accent (#eb6126) with white text is 3.34:1 and accent text on the page 3.23:1
// (WCAG AA needs 4.5:1 at these sizes). The look is the brand's (Figma, live site), so these stories report the
// colour-contrast result as a11y "todo" (shown in the a11y panel, not failing CI) until the palette is decided.
const CONTRAST_TODO = { a11y: { test: 'todo' } };

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

export const Accent = { parameters: CONTRAST_TODO };
export const Primary = { args: { variant: 'primary', text: 'Akcja' } };
export const Inverse = { args: { variant: 'inverse', text: 'Promocja' } };
