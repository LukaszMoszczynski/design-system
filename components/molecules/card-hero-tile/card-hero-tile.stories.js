import { STATE_ARG_TYPES, forceState, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { CARD_HEADING_TAGS } from '../card-program/card-program.template.js';
import { renderCardHeroTile } from './card-hero-tile.template.js';

// Hero tiles are 341 px wide on desktop (three in the 1104 px row), the full column on phones.
const tile = (markup) => `<div style="width: 341px; max-width: 100%">${markup}</div>`;
const frame = (markup) => `<div style="padding: var(--space-40) var(--space-gutter) var(--space-24)">${tile(markup)}</div>`;
const TILE = ['.ds-card-hero-tile'];

export default {
  title: 'Molecules/Card Hero Tile',
  render: (args) => frame(renderCardHeroTile(args)),
  argTypes: {
    title: { control: 'text' },
    tag: { control: 'text', description: 'Figma Show tag: the hashtag over the accent line; empty hides it.' },
    text: { control: 'text' },
    linkText: { control: 'text', description: 'Figma Show link: the bold text link (decorative inside the tile link).' },
    href: { control: 'text', description: 'Given: the whole tile is one link with the corner arrow.' },
    headingTag: { control: 'inline-radio', options: CARD_HEADING_TAGS },
    ...STATE_ARG_TYPES,
  },
  args: {
    title: 'Oferta szkoleń wewnętrznych',
    tag: '',
    text: 'Poznaj nasze programy dla liderów, zespołów, specjalistów i zarządów – znajdź rozwiązanie dla swojej organizacji.',
    linkText: 'Czytaj najnowsze artykuły',
    href: '#',
    headingTag: 'h3',
    state: 'default',
  },
  parameters: {
    stateTargets: TILE,
    docs: {
      description: {
        component:
          '`a.ds-card-hero-tile` (or `article`) > `h3.ds-card-hero-tile__title` + Tag hashtag + `p.ds-card-hero-tile__text` + `span.ds-link.ds-link--bold` + Button arrow (span). Desktop hover: brand surface, rises 20 px, the page-colour notch opens with the arrow in it; focus: the same without the notch. Below 1025 px: no arrow, focus ring only.',
      },
    },
  },
};

export const Playground = {};

// Figma Card/Hero tile: State Default, Hover, Focus (Mobile: the Mobile 390 viewport), and a tile with the tag.
export const Overview = {
  render: (args) =>
    `<div style="padding-top: var(--space-24)">${overviewGrid(
      [
        overviewCell('default', tile(renderCardHeroTile(args))),
        overviewCell('hover', tile(forceState(renderCardHeroTile(args), 'hover', TILE))),
        overviewCell('focus', tile(forceState(renderCardHeroTile(args), 'focus', TILE))),
        overviewCell('with tag, no link', tile(renderCardHeroTile({ ...args, tag: '#rozwijamySzczecin', linkText: '' }))),
      ],
      '341px',
    )}</div>`,
};
