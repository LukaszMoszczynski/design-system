import { OVERVIEW_STATE, STATE_ARG_TYPES, forceState, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { renderBreadcrumbs } from './breadcrumbs.template.js';

const HOME = { text: 'Strona główna', href: '/' };
const TRAINING = { text: 'Szkolenia', href: '/szkolenia/' };
const PROGRAMS = { text: 'Programy rozwojowe', href: '/szkolenia/programy/' };
const CURRENT = { text: 'Negocjacje handlowe' };
// Item states (Figma Breadcrumb/Item) are forced on the first link only.
const FIRST_LINK = ['.ds-breadcrumbs__item:first-child .ds-breadcrumbs__link'];
const frame = (markup) => `<div style="padding: var(--space-gutter)">${markup}</div>`;

export default {
  title: 'Atoms/Breadcrumbs',
  render: (args) => frame(renderBreadcrumbs(args)),
  argTypes: {
    items: { control: 'object', description: '`[{ text, href }]`; the last item is the current page (no href).' },
    ariaLabel: { control: 'text', description: 'Accessible name of the `<nav>`.' },
    ...STATE_ARG_TYPES,
  },
  args: { items: [HOME, TRAINING, CURRENT], ariaLabel: 'Ścieżka nawigacji', state: 'default' },
  parameters: {
    stateTargets: FIRST_LINK,
    docs: {
      description: {
        component:
          '`nav.ds-breadcrumbs > ol.ds-breadcrumbs__list > li.ds-breadcrumbs__item`, links `.ds-breadcrumbs__link`, the last item `span.ds-breadcrumbs__current[aria-current="page"]`. The › is CSS. The mobile look is the Mobile 390 viewport.',
      },
    },
  },
};

export const Playground = {};

// Figma Breadcrumb: 2, 3 and 4 levels, and the first item hovered and focused.
export const Overview = {
  ...OVERVIEW_STATE,
  render: (args) => {
    // Every trail is a landmark of its own: a distinct name for each.
    const trail = (items, name, state = 'default') =>
      frame(forceState(renderBreadcrumbs({ ...args, items, ariaLabel: `${args.ariaLabel}, ${name}` }), state, FIRST_LINK));
    const levels3 = [HOME, TRAINING, CURRENT];
    return overviewGrid(
      [
        overviewCell('2 levels', trail([HOME, CURRENT], '2 levels'), true),
        overviewCell('3 levels', trail(levels3, '3 levels'), true),
        overviewCell('4 levels', trail([HOME, TRAINING, PROGRAMS, CURRENT], '4 levels'), true),
        overviewCell('item hover', trail(levels3, 'hover', 'hover'), true),
        overviewCell('item focus', trail(levels3, 'focus', 'focus'), true),
      ],
      '400px',
    );
  },
};
