import { overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { CHECK_TONES, renderCheckList } from './check-item.template.js';

const surface = (tone, markup) =>
  `<div style="max-width: 408px; padding: var(--space-24); ${tone === 'on-brand' ? 'background: var(--color-surface-brand)' : ''}">${markup}</div>`;
const toItems = (text) => String(text).split('\n').filter(Boolean);

export default {
  title: 'Molecules/Check Item',
  render: (args) => surface(args.tone, renderCheckList({ ...args, items: toItems(args.items) })),
  argTypes: {
    items: { control: 'text', description: 'One item per line.' },
    tone: { control: 'inline-radio', options: CHECK_TONES, description: 'Figma Tone: Default, On brand (white text on a blue card).' },
  },
  args: {
    items: 'szef czuje się przeciążony i zagubiony w operacyjnym chaosie\nzespół nie wie, jakie ma priorytety',
    tone: 'default',
  },
  parameters: {
    docs: {
      description: {
        component:
          '`ul.ds-check-list` (+ `ds-check-list--on-brand`) of `li.ds-check-item` = `svg.ds-check-item__icon` (27 px accent circle, tick in currentColor) + `span.ds-check-item__text`. Rows 12 px apart.',
      },
    },
  },
};

export const Playground = {};

// Figma Tone: Default, On brand.
export const Overview = {
  render: (args) =>
    overviewGrid(
      CHECK_TONES.map((tone) => overviewCell(tone, surface(tone, renderCheckList({ items: toItems(args.items), tone })))),
      '360px',
    ),
};
