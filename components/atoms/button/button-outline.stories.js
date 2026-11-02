import { OVERVIEW_STATE, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { renderButtonOutline } from './button.template.js';

// The outline takes currentColor: "On brand" is the same markup inside a blue (hovered) program card.
const onPage = (markup) => `<div style="padding: var(--space-24); color: var(--color-text-default)">${markup}</div>`;
const onBrand = (markup) =>
  `<div style="display: inline-block; padding: var(--space-24); background: var(--color-surface-brand); color: var(--color-text-on-brand)">${markup}</div>`;

export default {
  title: 'Atoms/Button Outline',
  render: (args) => onPage(renderButtonOutline(args)),
  argTypes: {
    text: { control: 'text', description: 'Visible text.' },
    href: { control: 'text', description: 'Empty inside a card that is itself the link (renders a `<span>`).' },
  },
  args: { text: 'Więcej', href: '' },
  parameters: {
    docs: {
      description: {
        component: '`.ds-button-outline`: 1 px currentColor pill, 4/12 padding, body text (the program card\'s "Więcej"). Figma Button/Outline. No states of its own.',
      },
    },
  },
};

export const Playground = {};

// The colour follows the surface.
export const Overview = {
  ...OVERVIEW_STATE,
  render: (args) =>
    overviewGrid([overviewCell('on the page', onPage(renderButtonOutline(args))), overviewCell('on brand', onBrand(renderButtonOutline(args)))], '200px'),
};
