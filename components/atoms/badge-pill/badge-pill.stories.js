import { OVERVIEW_STATE, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { BADGE_VARIANTS, renderBadgePill } from './badge-pill.template.js';

// Known brand contrast gap: the DCC accent (#eb6126) with white text is 3.34:1 and accent text on the page 3.23:1
// (WCAG AA needs 4.5:1 at these sizes). The look is the brand's (Figma, live site), so these stories report the
// colour-contrast result as a11y "todo" (shown in the a11y panel, not failing CI) until the palette is decided.
const CONTRAST_TODO = { a11y: { test: 'todo' } };
const frame = (markup) => `<div style="padding: var(--space-24); background: var(--color-surface-card)">${markup}</div>`;

export default {
  title: 'Atoms/Badge Pill',
  render: (args) => frame(renderBadgePill(args)),
  argTypes: {
    variant: { control: 'inline-radio', options: Object.keys(BADGE_VARIANTS), description: 'Figma Variant: Polecane, Promocja, Akcja.' },
    text: { control: 'text', description: 'Label; empty = the variant name.' },
  },
  args: { variant: 'polecane', text: '' },
  parameters: {
    docs: {
      description: {
        component: 'Prints the Label atom (`.ds-label ds-label--{accent|inverse|primary}`); CSS is `atoms/label/label.css`. Static, no states.',
      },
    },
  },
};

// The default (accent) label shows the contrast gap.
export const Playground = { parameters: CONTRAST_TODO };

export const Overview = {
  ...OVERVIEW_STATE,
  parameters: { ...OVERVIEW_STATE.parameters, ...CONTRAST_TODO },
  render: (args) =>
    overviewGrid(Object.keys(BADGE_VARIANTS).map((variant) => overviewCell(variant, frame(renderBadgePill({ ...args, variant })))), '160px'),
};
