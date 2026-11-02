import { BADGE_VARIANTS, renderBadgePill } from './badge-pill.template.js';

// Known brand contrast gap: the DCC accent (#eb6126) with white text is 3.34:1 and accent text on the page 3.23:1
// (WCAG AA needs 4.5:1 at these sizes). The look is the brand's (Figma, live site), so these stories report the
// colour-contrast result as a11y "todo" (shown in the a11y panel, not failing CI) until the palette is decided.
const CONTRAST_TODO = { a11y: { test: 'todo' } };

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

export const Polecane = { parameters: CONTRAST_TODO };
export const Promocja = { args: { variant: 'promocja' } };
export const Akcja = { args: { variant: 'akcja' } };
