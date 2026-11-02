import { renderButtonOutline } from './button.template.js';

// The outline takes currentColor: "On brand" is the same markup inside a blue (hovered) program card.
const onBrand = (markup) =>
  `<div style="display: inline-block; padding: var(--space-24); background: var(--color-surface-brand); color: var(--color-text-on-brand)">${markup}</div>`;

export default {
  title: 'Atoms/Button Outline',
  render: (args) => `<div style="padding: var(--space-24); color: var(--color-text-default)">${renderButtonOutline(args)}</div>`,
  argTypes: {
    label: { control: 'text' },
    href: { control: 'text', description: 'Empty inside a card that is itself the link (renders a `<span>`).' },
  },
  args: { label: 'Więcej', href: '' },
  parameters: {
    docs: {
      description: {
        component: '`.ds-button-outline`: 1 px currentColor pill, 4/12 padding, body text (the program card\'s "Więcej"). Figma Button/Outline.',
      },
    },
  },
};

export const Default = {};
export const OnBrand = { render: (args) => onBrand(renderButtonOutline(args)) };
