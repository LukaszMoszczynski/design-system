import { OVERVIEW_STATE, STATE_ARG_TYPES, forceState, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { CARD_HEADING_TAGS } from '../../_shared/heading-tags.js';
import { renderCardTile } from './card-tile.template.js';

const card = (markup) => `<div style="width: var(--size-card-width); max-width: 100%">${markup}</div>`;
const frame = (markup) => `<div style="padding: var(--space-24) var(--space-gutter)">${card(markup)}</div>`;
const CARD = ['.ds-card-tile'];

export default {
  title: 'Molecules/Card Tile',
  render: (args) => frame(renderCardTile(args)),
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    text: { control: 'text' },
    href: { control: 'text', description: 'Given: the whole card is one link. Empty: an article without hover.' },
    headingTag: { control: 'inline-radio', options: CARD_HEADING_TAGS },
    ...STATE_ARG_TYPES,
  },
  args: {
    title: 'Akredytacja Insights Discovery',
    subtitle: 'Certyfikacja · 3 dni',
    text: 'Uprawnienia do pracy z profilem Insights Discovery w zespołach i w coachingu indywidualnym.',
    href: '#',
    headingTag: 'h3',
    state: 'default',
  },
  parameters: {
    stateTargets: CARD,
    docs: {
      description: {
        component:
          '`a.ds-card-tile` (or `article`) > `div.ds-card-tile__title-box` (`h3.ds-card-tile__title`, transparent at rest) + `div.ds-card-tile__texts` (`__subtitle`, `__text`). Hover / focus: brand surface, the title box in the page colour.',
      },
    },
  },
};

export const Playground = {};

// Figma Card/Tile: State Default, Hover, Focus.
export const Overview = {
  ...OVERVIEW_STATE,
  render: (args) =>
    overviewGrid(
      ['default', 'hover', 'focus'].map((state) => overviewCell(state, card(forceState(renderCardTile(args), state, CARD)))),
      '384px',
    ),
};
