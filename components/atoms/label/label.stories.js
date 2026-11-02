import { OVERVIEW_STATE, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { LABEL_VARIANTS, renderLabel } from './label.template.js';

// Known brand contrast gap: the DCC accent (#eb6126) with white text is 3.34:1 and accent text on the page 3.23:1
// (WCAG AA needs 4.5:1 at these sizes). The look is the brand's (Figma, live site), so these stories report the
// colour-contrast result as a11y "todo" (shown in the a11y panel, not failing CI) until the palette is decided.
const CONTRAST_TODO = { a11y: { test: 'todo' } };
const frame = (markup) => `<div style="padding: var(--space-24)">${markup}</div>`;

export default {
  title: 'Atoms/Label',
  render: (args) => frame(renderLabel(args)),
  argTypes: {
    text: { control: 'text' },
    variant: { control: 'inline-radio', options: LABEL_VARIANTS, description: 'Figma Variant: Accent, Primary, Inverse.' },
  },
  args: { text: 'Polecane', variant: 'accent' },
  parameters: {
    docs: { description: { component: '`.ds-label ds-label--{accent|primary|inverse}` (.dcc-odznaka). Static, no states.' } },
  },
};

// The default (accent) label shows the contrast gap.
export const Playground = { parameters: CONTRAST_TODO };

export const Overview = {
  ...OVERVIEW_STATE,
  parameters: { ...OVERVIEW_STATE.parameters, ...CONTRAST_TODO },
  render: (args) => overviewGrid(LABEL_VARIANTS.map((variant) => overviewCell(variant, frame(renderLabel({ ...args, variant })))), '160px'),
};
