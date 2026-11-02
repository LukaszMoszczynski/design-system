import { OVERVIEW_STATE, STATE_ARG_TYPES, forceState, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { BUTTON_ARROW_VARIANTS, renderButtonArrow } from './button.template.js';

const ARROW = ['.ds-button-arrow'];
const frame = (markup) => `<div style="padding: var(--space-24); background: var(--color-surface-card)">${markup}</div>`;

export default {
  title: 'Atoms/Button Arrow',
  render: (args) => frame(renderButtonArrow(args)),
  argTypes: {
    href: { control: 'text', description: 'Empty: a decorative `<span>` (a card link carries the name). With a URL: a link named by `ariaLabel`, with hover and focus.' },
    ariaLabel: { control: 'text', description: 'Accessible name, used only with href.' },
    variant: { control: 'inline-radio', options: BUTTON_ARROW_VARIANTS, description: 'Figma State: Default, Inverted (page-colour circle, primary arrow: the program card at rest).' },
    ...STATE_ARG_TYPES,
  },
  args: { href: '#', ariaLabel: 'Czytaj dalej', variant: 'default', state: 'default' },
  parameters: {
    stateTargets: ARROW,
    docs: { description: { component: '`.ds-button-arrow` (+ `ds-button-arrow--inverted`): 42 px circle with an 18 px arrow. Figma Button/Arrow.' } },
  },
};

export const Playground = {};

// Both variants as a link, at rest, hover and focus.
export const Overview = {
  ...OVERVIEW_STATE,
  render: (args) =>
    overviewGrid(
      BUTTON_ARROW_VARIANTS.flatMap((variant) =>
        ['default', 'hover', 'focus'].map((state) =>
          overviewCell(`${variant} · ${state}`, frame(forceState(renderButtonArrow({ ...args, variant, href: '#' }), state, ARROW))),
        ),
      ),
      '160px',
    ),
};
