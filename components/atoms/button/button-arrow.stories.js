import { BUTTON_ARROW_VARIANTS, renderButtonArrow } from './button.template.js';

export default {
  title: 'Atoms/Button Arrow',
  render: (args) => `<div style="padding: var(--space-24); background: var(--color-surface-card)">${renderButtonArrow(args)}</div>`,
  argTypes: {
    href: { control: 'text', description: 'Empty: a decorative `<span>` (a card link carries the name). With a URL: a link named by `ariaLabel`.' },
    ariaLabel: { control: 'text', description: 'Accessible name, used only with href.' },
    variant: { control: 'inline-radio', options: BUTTON_ARROW_VARIANTS, description: 'Figma State: Default, Inverted (page-colour circle, primary arrow: the program card at rest).' },
  },
  args: { href: '', ariaLabel: 'Czytaj dalej', variant: 'default' },
  parameters: {
    docs: { description: { component: '`.ds-button-arrow` (+ `ds-button-arrow--inverted`): 42 px circle with an 18 px arrow. Figma Button/Arrow.' } },
  },
};

export const Default = {};
export const Inverted = { args: { variant: 'inverted' } };
export const LinkHover = { args: { href: '#' }, globals: { pseudo: { hover: ['.ds-button-arrow'] } } };
