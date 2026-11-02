import { OVERVIEW_STATE, STATE_ARG_TYPES, forceState, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { TAG_VARIANTS, renderTag } from './tag.template.js';

// White-on-colour variants sit on the surface they are used on.
const BACKDROPS = {
  white: 'var(--color-surface-muted)',
  'article-white': 'var(--color-surface-muted)',
  soft: 'var(--color-surface-card)',
  hashtag: 'var(--color-surface-brand)',
};
const frame = (variant, markup) =>
  `<div style="display: inline-block; padding: var(--space-24); background: ${BACKDROPS[variant] ?? 'var(--color-surface-page)'}">${markup}</div>`;
const TAG = ['.ds-tag'];

export default {
  title: 'Atoms/Tag',
  render: (args) => frame(args.variant, renderTag(args)),
  argTypes: {
    text: { control: 'text' },
    variant: { control: 'select', options: TAG_VARIANTS, description: 'Figma Variant.' },
    href: { control: 'text', description: 'With a URL the tag is a link (`<a href>`): focus ring and a hairline outline on hover.' },
    datetime: { control: 'text', description: 'Machine date: the tag is a `<time datetime>` (the post date).' },
    tag: { control: 'inline-radio', options: ['span', 'li'], description: 'Element when there is no href or datetime (li in a list of skills).' },
    ...STATE_ARG_TYPES,
  },
  args: { text: 'Przetestowany', variant: 'soft', href: '', datetime: '', tag: 'span', state: 'default' },
  parameters: {
    stateTargets: TAG,
    docs: { description: { component: '`.ds-tag ds-tag--{variant}`. Static, except as a link (`href`): focus ring and a hairline outline on hover.' } },
  },
};

export const Playground = {};

// Every variant as plain text (the post date as a `<time>`, the hashtag with its own text).
const SAMPLES = {
  white: { text: '12 października 2026', datetime: '2026-10-12' },
  hashtag: { text: '#PozytywnieRozwojowi' },
};
export const Overview = {
  ...OVERVIEW_STATE,
  render: (args) =>
    overviewGrid(
      TAG_VARIANTS.map((variant) => overviewCell(variant, frame(variant, renderTag({ ...args, variant, href: '', datetime: '', ...SAMPLES[variant] })))),
      '200px',
    ),
};

// A tag as a link (the blog topic): at rest, hover and focus.
export const Link = {
  ...OVERVIEW_STATE,
  render: (args) =>
    overviewGrid(
      ['default', 'hover', 'focus'].map((state) =>
        overviewCell(state, frame('article', forceState(renderTag({ ...args, variant: 'article', text: 'Przywództwo', href: '/blog/przywodztwo/', datetime: '' }), state, TAG))),
      ),
      '200px',
    ),
};
