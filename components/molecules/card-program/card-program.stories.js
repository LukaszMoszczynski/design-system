import { OVERVIEW_STATE, STATE_ARG_TYPES, forceState, overviewCell, overviewGrid, stateControlPlay } from '../../../.storybook/state.js';
import { CARD_HEADING_TAGS } from '../../_shared/heading-tags.js';
import { renderCardProgram } from './card-program.template.js';

const card = (markup) => `<div style="width: var(--size-card-width); max-width: 100%">${markup}</div>`;
const frame = (markup) => `<div style="padding: var(--space-24) var(--space-gutter)">${card(markup)}</div>`;
const CARD = ['.ds-card-program'];

export default {
  title: 'Molecules/Card Program',
  render: (args) => frame(renderCardProgram(args)),
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    text: { control: 'text' },
    moreText: { control: 'text', description: 'The outline pill (decorative inside the card link).' },
    href: { control: 'text', description: 'Given: the whole card is one link. Empty: an article without hover.' },
    headingTag: { control: 'inline-radio', options: CARD_HEADING_TAGS },
    ...STATE_ARG_TYPES,
  },
  args: {
    title: 'Negocjacje handlowe',
    subtitle: 'Szkolenie otwarte · 2 dni',
    text: 'Praktyczny warsztat dla handlowców i kupców: przygotowanie, prowadzenie i domykanie trudnych negocjacji.',
    moreText: 'Więcej',
    href: '#',
    headingTag: 'h3',
    state: 'default',
  },
  parameters: {
    stateTargets: CARD,
    docs: {
      description: {
        component:
          '`a.ds-card-program` (or `article` without href) > `div.ds-card-program__title-box` (stepped on desktop, `h3.ds-card-program__title`) + `div.ds-card-program__texts` (`__subtitle`, `__text`) + `div.ds-card-program__footer` (Button outline + Button arrow inverted, both spans). Hover / focus: brand surface. Figma Viewport=Mobile: the Mobile 390 viewport (plain title box, hugging height).',
      },
    },
  },
};

// The play proves the state control works (a computed style changes with state: hover).
export const Playground = { play: stateControlPlay({ selector: '.ds-card-program' }) };

// Figma Card/Program: State Default, Hover, Focus (Mobile: the Mobile 390 viewport).
export const Overview = {
  ...OVERVIEW_STATE,
  render: (args) =>
    overviewGrid(
      ['default', 'hover', 'focus'].map((state) => overviewCell(state, card(forceState(renderCardProgram(args), state, CARD)))),
      '384px',
    ),
};
