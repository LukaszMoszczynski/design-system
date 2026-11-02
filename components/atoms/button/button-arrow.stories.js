import { renderButtonArrow } from './button.template.js';

export default {
  title: 'Atoms/Button Arrow',
  render: (args) => `<div style="padding: var(--space-24); background: var(--color-surface-card)">${renderButtonArrow(args)}</div>`,
  argTypes: {
    href: { control: 'text', description: 'Empty: a decorative `<span>` (a card link carries the name). With a URL: a link named by `label`.' },
    label: { control: 'text', description: 'aria-label, used only with href.' },
    inverted: { control: 'boolean', description: 'Figma State=Inverted: page-colour circle, primary arrow (program card at rest).' },
  },
  args: { href: '', label: 'Czytaj dalej', inverted: false },
  parameters: {
    docs: { description: { component: '`.ds-button-arrow` (+ `ds-button-arrow--inverted`): 42 px circle with an 18 px arrow. Figma Button/Arrow.' } },
  },
};

export const Default = {};
export const Inverted = { args: { inverted: true } };
export const LinkHover = { args: { href: '#' }, globals: { pseudo: { hover: ['.ds-button-arrow'] } } };
