import { ICON_NAMES, renderIcon } from './icon.template.js';

export default {
  title: 'Atoms/Icon',
  render: (args) => `<div style="padding: var(--space-24); color: var(--color-text-default)">${renderIcon(args)}</div>`,
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

export const ArrowDiagonal = {};
export const ChevronLeft = { args: { name: 'chevron-left' } };
export const ChevronRight = { args: { name: 'chevron-right' } };
export const Plus = { args: { name: 'plus' } };
export const Minus = { args: { name: 'minus' } };

// Every icon in one row, as the Figma section shows them.
export const All = {
  render: () =>
    `<div style="display: flex; gap: var(--space-24); padding: var(--space-24); color: var(--color-text-default)">${ICON_NAMES.map((name) => renderIcon({ name })).join('')}</div>`,
};
