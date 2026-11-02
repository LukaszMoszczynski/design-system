import { STATE_ARG_TYPES, forceState, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { CARD_HEADING_TAGS } from '../card-program/card-program.template.js';
import { CARD_POST_ARROWS, renderCardPost } from './card-post.template.js';

const card = (markup) => `<div style="width: var(--size-post-card-width); max-width: 100%">${markup}</div>`;
const frame = (markup) => `<div style="padding: var(--space-24) var(--space-gutter)">${card(markup)}</div>`;
const CARD = ['.ds-card-post'];

export default {
  title: 'Molecules/Card Post',
  render: (args) => frame(renderCardPost(args)),
  argTypes: {
    title: { control: 'text' },
    excerpt: { control: 'text' },
    date: { control: 'text', description: 'The date pill text; empty hides it.' },
    datetime: { control: 'text', description: 'ISO date for <time datetime>.' },
    image: { control: 'text', description: 'Photo URL (cover). Empty: the muted surface.' },
    href: { control: 'text', description: 'Given: the whole card is one link.' },
    arrow: { control: 'inline-radio', options: CARD_POST_ARROWS, description: 'Figma Arrow: Accent (carousel, grid), Primary (under a post).' },
    headingTag: { control: 'inline-radio', options: CARD_HEADING_TAGS },
    ...STATE_ARG_TYPES,
  },
  args: {
    title: 'Jak stać się mentorem we własnej firmie?',
    excerpt: 'Jeśli zmieniłeś swoje wyobrażenia o inspirującym życiu szefa i większość rzeczy w firmie wykonujesz…',
    date: '26 kwietnia 2016',
    datetime: '2016-04-26',
    image: './placeholders/square.svg',
    href: '#',
    arrow: 'accent',
    headingTag: 'h3',
    state: 'default',
  },
  parameters: {
    stateTargets: CARD,
    docs: {
      description: {
        component:
          '`a.ds-card-post ds-card-post--arrow-{accent|primary}` > `div.ds-card-post__media` (`img.__image` + Tag white as `<time>`) + `div.ds-card-post__body` (`h3.__title`, `p.__excerpt`, Button arrow). Hover / focus: photo zoom 5 %, arrow colour swapped. Figma Viewport=Mobile: the Mobile 390 viewport (stacked).',
      },
    },
  },
};

export const Playground = {};

// Figma Card/Post: Arrow Accent and Primary × State Default, Hover.
export const Overview = {
  render: (args) =>
    overviewGrid(
      CARD_POST_ARROWS.flatMap((arrow) => [
        overviewCell(`${arrow}, default`, card(renderCardPost({ ...args, arrow }))),
        overviewCell(`${arrow}, hover`, card(forceState(renderCardPost({ ...args, arrow }), 'hover', CARD))),
      ]),
      '560px',
    ),
};
