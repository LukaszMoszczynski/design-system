import { STATE_ARG_TYPES, forceState, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { CARD_HEADING_TAGS } from '../card-program/card-program.template.js';
import { renderCardPerson } from './card-person.template.js';

const card = (markup) => `<div style="width: var(--size-card-width); max-width: 100%">${markup}</div>`;
const frame = (markup) => `<div style="padding: var(--space-24) var(--space-gutter)">${card(markup)}</div>`;
const CARD = ['.ds-card-person'];

export default {
  title: 'Molecules/Card Person',
  render: (args) => frame(renderCardPerson(args)),
  argTypes: {
    name: { control: 'text' },
    roles: { control: 'object', description: 'Lines of roles (one line: A  |  B).' },
    image: { control: 'text', description: 'Portrait URL (cover). Empty: the muted surface.' },
    imageAlt: { control: 'text', description: 'Usually empty: the name already names the card.' },
    href: { control: 'text', description: 'Given: the whole card is one link.' },
    headingTag: { control: 'inline-radio', options: CARD_HEADING_TAGS },
    ...STATE_ARG_TYPES,
  },
  args: {
    name: 'Anna Grygorcewicz',
    roles: ['Executive coaching  |  Coaching menedżerski', 'Gramy do jednej bramki  |  Konsulting'],
    image: './placeholders/portrait.svg',
    imageAlt: '',
    href: '#',
    headingTag: 'h3',
    state: 'default',
  },
  parameters: {
    stateTargets: CARD,
    docs: {
      description: {
        component:
          '`a.ds-card-person` (or `article`) > `span.ds-card-person__photo > img` (cover) + `div.ds-card-person__body` (`h3.ds-card-person__name`, `p.ds-card-person__roles`). Hover / focus: the photo zooms 4 %.',
      },
    },
  },
};

export const Playground = {};

// Figma Card/Person: State Default, Hover (and focus); and the card without a photo.
export const Overview = {
  render: (args) =>
    overviewGrid(
      [
        overviewCell('default', card(renderCardPerson(args))),
        overviewCell('hover', card(forceState(renderCardPerson(args), 'hover', CARD))),
        overviewCell('focus', card(forceState(renderCardPerson(args), 'focus', CARD))),
        overviewCell('no photo', card(renderCardPerson({ ...args, image: '' }))),
      ],
      '384px',
    ),
};
