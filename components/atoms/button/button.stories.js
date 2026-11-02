import { BUTTON_SHAPES, BUTTON_VARIANTS, renderButton } from './button.template.js';

// Known brand contrast gap: the DCC accent (#eb6126) with white text is 3.34:1 and accent text on the page 3.23:1
// (WCAG AA needs 4.5:1 at these sizes). The look is the brand's (Figma, live site), so these stories report the
// colour-contrast result as a11y "todo" (shown in the a11y panel, not failing CI) until the palette is decided.
const CONTRAST_TODO = { a11y: { test: 'todo' } };

const PROPOSAL = 'Proposal: the site has no pressed or disabled button styles (Figma legend, Button section).';

// One story per Figma variant: Variant (Figma Style) × Shape × State. States are forced with story globals.pseudo (see components/README.md).
function story(variant, shape, state) {
  const result = { args: { variant, shape, disabled: state === 'disabled' } };
  if (state === 'hover') result.globals = { pseudo: { hover: ['.ds-button'] } };
  if (state === 'focus') result.globals = { pseudo: { focusVisible: ['.ds-button'] } };
  if (state === 'pressed') result.globals = { pseudo: { active: ['.ds-button'] } };
  if (variant === 'accent' && state === 'default') result.parameters = CONTRAST_TODO;
  if (state === 'pressed' || state === 'disabled') {
    result.parameters = { docs: { description: { story: PROPOSAL } } };
  }
  return result;
}

export default {
  title: 'Atoms/Button',
  render: (args) => `<div style="padding: var(--space-24)">${renderButton(args)}</div>`,
  argTypes: {
    text: { control: 'text', description: 'Visible text.' },
    href: { control: 'text', description: 'With a URL the button is an `<a>`, without one a `<button type="button">`.' },
    variant: { control: 'inline-radio', options: BUTTON_VARIANTS, description: 'Figma Style: Primary, Accent, Light.' },
    shape: { control: 'inline-radio', options: BUTTON_SHAPES, description: 'Figma Shape: Arrow (label + icon circle) or Pill.' },
    disabled: { control: 'boolean', description: 'Figma State=Disabled (proposal).' },
  },
  args: { text: 'Poznaj ofertę', href: '', variant: 'primary', shape: 'arrow', disabled: false },
  parameters: {
    docs: {
      description: {
        component:
          '`.ds-button ds-button--{primary|accent|light}` (+ `ds-button--pill`), children `.ds-button__label` and `.ds-button__icon`. Hover and Focus share the gradient and the accent circle; Focus adds the ring. Pressed and Disabled are proposals.',
      },
    },
  },
};

export const PrimaryArrow = story('primary', 'arrow', 'default');
export const PrimaryArrowHover = story('primary', 'arrow', 'hover');
export const PrimaryArrowFocus = story('primary', 'arrow', 'focus');
export const PrimaryArrowPressed = story('primary', 'arrow', 'pressed');
export const PrimaryArrowDisabled = story('primary', 'arrow', 'disabled');
export const AccentArrow = story('accent', 'arrow', 'default');
export const AccentArrowHover = story('accent', 'arrow', 'hover');
export const AccentArrowFocus = story('accent', 'arrow', 'focus');
export const AccentArrowPressed = story('accent', 'arrow', 'pressed');
export const AccentArrowDisabled = story('accent', 'arrow', 'disabled');
export const LightArrow = story('light', 'arrow', 'default');
export const LightArrowHover = story('light', 'arrow', 'hover');
export const LightArrowFocus = story('light', 'arrow', 'focus');
export const LightArrowPressed = story('light', 'arrow', 'pressed');
export const LightArrowDisabled = story('light', 'arrow', 'disabled');
export const PrimaryPill = story('primary', 'pill', 'default');
export const PrimaryPillHover = story('primary', 'pill', 'hover');
export const PrimaryPillFocus = story('primary', 'pill', 'focus');
export const PrimaryPillPressed = story('primary', 'pill', 'pressed');
export const PrimaryPillDisabled = story('primary', 'pill', 'disabled');
export const AccentPill = story('accent', 'pill', 'default');
export const AccentPillHover = story('accent', 'pill', 'hover');
export const AccentPillFocus = story('accent', 'pill', 'focus');
export const AccentPillPressed = story('accent', 'pill', 'pressed');
export const AccentPillDisabled = story('accent', 'pill', 'disabled');
export const LightPill = story('light', 'pill', 'default');
export const LightPillHover = story('light', 'pill', 'hover');
export const LightPillFocus = story('light', 'pill', 'focus');
export const LightPillPressed = story('light', 'pill', 'pressed');
export const LightPillDisabled = story('light', 'pill', 'disabled');

// The Figma matrix at rest: rows Shape × Variant. Forced states are the single stories above.
export const Overview = {
  parameters: CONTRAST_TODO,
  render: (args) =>
    `<div style="display: grid; gap: var(--space-24); padding: var(--space-24); justify-items: start">${BUTTON_SHAPES.flatMap((shape) =>
      BUTTON_VARIANTS.map((variant) => renderButton({ ...args, variant, shape })),
    ).join('')}</div>`,
};

