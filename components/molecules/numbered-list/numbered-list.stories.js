import { OVERVIEW_STATE, STATE_ARG_TYPES, forceState, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { DEFAULT_NUMBERED_ITEMS, renderNumberedList } from './numbered-list.template.js';

const frame = (markup) => `<div style="max-width: 584px; padding: var(--space-24)">${markup}</div>`;

export default {
  title: 'Molecules/Numbered List',
  render: (args) => frame(renderNumberedList(args)),
  argTypes: {
    items: { control: 'object', description: 'The steps: an array of strings, numbered from 1.' },
    ...STATE_ARG_TYPES,
  },
  args: { items: DEFAULT_NUMBERED_ITEMS, state: 'default' },
  parameters: {
    stateTargets: ['.ds-numbered-list__item:first-child'],
    docs: {
      description: {
        component:
          '`ol.ds-numbered-list[role=list]` > `li.ds-numbered-list__item` (Letter circle `ds-letter-circle--step` + Text `ds-text--2xl-medium ds-numbered-list__text`). Hover: the row number turns accent and grows. State applies to the first row.',
      },
    },
  },
};

export const Playground = {};

// The list at rest and with its first row hovered.
export const Overview = {
  ...OVERVIEW_STATE,
  render: () =>
    overviewGrid(
      [
        overviewCell('Default', frame(renderNumberedList())),
        overviewCell('First row hover', frame(forceState(renderNumberedList(), 'hover', ['.ds-numbered-list__item:first-child']))),
      ],
      '480px',
    ),
};
