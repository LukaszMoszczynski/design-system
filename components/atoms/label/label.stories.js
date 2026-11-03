import { CONTRAST_OFF } from '../../../.storybook/a11y.js';
import { OVERVIEW_STATE, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { LABEL_VARIANTS, renderLabel } from './label.template.js';

// Known brand contrast gap: the DCC accent (#eb6126) with white text is 3.34:1 and accent text on the page 3.23:1
// (WCAG AA needs 4.5:1 at these sizes). The look is the brand's (Figma, live site), so on these stories
// colour-contrast is off (the DCC palette contrast is the owner's decision, .storybook/a11y.js); every other a11y rule
// still fails CI.
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
export const Playground = { parameters: { a11y: CONTRAST_OFF } };

export const Overview = {
  ...OVERVIEW_STATE,
  parameters: { ...OVERVIEW_STATE.parameters, a11y: CONTRAST_OFF },
  render: (args) => overviewGrid(LABEL_VARIANTS.map((variant) => overviewCell(variant, frame(renderLabel({ ...args, variant })))), '160px'),
};
