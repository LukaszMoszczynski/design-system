import { OVERVIEW_STATE, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { ICON_NAMES, renderIcon } from './icon.template.js';

const frame = (markup) => `<div style="padding: var(--space-24); color: var(--color-text-default)">${markup}</div>`;

export default {
  title: 'Atoms/Icon',
  render: (args) => frame(renderIcon(args)),
  argTypes: {
    name: { control: 'select', options: ICON_NAMES },
  },
  args: { name: 'arrow-diagonal' },
  parameters: {
    docs: {
      description: {
        component:
          'Inline SVG, `stroke="currentColor"`: the parent sets the colour (Figma: strokes bound to Semantic colours and overridden by the parent). Classes `ds-icon ds-icon--{name}`.',
      },
    },
  },
};

export const Playground = {};

// Every icon, as the Figma section shows them.
export const Overview = {
  ...OVERVIEW_STATE,
  render: () => overviewGrid(ICON_NAMES.map((name) => overviewCell(name, frame(renderIcon({ name })))), '120px'),
};
