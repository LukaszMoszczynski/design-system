import { CONTRAST_OFF } from '../../../.storybook/a11y.js';
import { OVERVIEW_STATE, STATE_ARG_TYPES, forceState, overviewCell, overviewGrid, stateControlPlay } from '../../../.storybook/state.js';
import { BUTTON_SHAPES, BUTTON_VARIANTS, renderButton } from './button.template.js';

// Known brand contrast gap: the DCC accent (#eb6126) with white text is 3.34:1 and accent text on the page 3.23:1
// (WCAG AA needs 4.5:1 at these sizes). The look is the brand's (Figma, live site), so on the Overview, which shows the
// accent button, colour-contrast is off (the DCC palette contrast is the owner's decision, .storybook/a11y.js); every other a11y rule
// still fails CI.
const BUTTON = ['.ds-button'];

export default {
  title: 'Atoms/Button',
  render: (args) => `<div style="padding: var(--space-24)">${renderButton(args)}</div>`,
  argTypes: {
    text: { control: 'text', description: 'Visible text.' },
    href: { control: 'text', description: 'With a URL the button is an `<a>`, without one a `<button type="button">`.' },
    variant: { control: 'inline-radio', options: BUTTON_VARIANTS, description: 'Figma Style: Primary, Accent, Light.' },
    accentIcon: { control: 'boolean', description: 'The accent circle at rest (a Light button on a blue surface: Hero, Call to action).' },
    uppercase: { control: 'boolean', description: 'The label in capitals (Text + image / Centered).' },
    shape: { control: 'inline-radio', options: BUTTON_SHAPES, description: 'Figma Shape: Arrow (label + icon circle) or Pill.' },
    disabled: { control: 'boolean', description: 'Figma State=Disabled (proposal: the site has no disabled button).' },
    ...STATE_ARG_TYPES,
  },
  args: { text: 'Poznaj ofertę', href: '', variant: 'primary', shape: 'arrow', disabled: false, accentIcon: false, uppercase: false, state: 'default' },
  parameters: {
    stateTargets: BUTTON,
    docs: {
      description: {
        component:
          '`.ds-button ds-button--{primary|accent|light}` (+ `ds-button--pill`), children `.ds-button__label` and `.ds-button__icon`. Hover and Focus share the gradient and the accent circle; Focus adds the ring. Disabled is a proposal.',
      },
    },
  },
};

// The play proves the state control works (the hover gradient replaces the flat background).
export const Playground = { play: stateControlPlay({ selector: '.ds-button', property: 'background-image' }) };

// Figma Button: Style × Shape, at rest, hover and focus. Disabled is the `disabled` control.
export const Overview = {
  ...OVERVIEW_STATE,
  parameters: { ...OVERVIEW_STATE.parameters, a11y: CONTRAST_OFF },
  render: (args) =>
    overviewGrid(
      BUTTON_SHAPES.flatMap((shape) =>
        BUTTON_VARIANTS.flatMap((variant) =>
          ['default', 'hover', 'focus'].map((state) =>
            overviewCell(`${variant} · ${shape} · ${state}`, forceState(renderButton({ ...args, variant, shape }), state, BUTTON)),
          ),
        ),
      ),
      '220px',
    ),
};
