import { CHECK_TONES, renderCheckList } from './check-item.template.js';

const frame = (args, markup) =>
  `<div style="max-width: 408px; padding: var(--space-24); ${args.tone === 'on-brand' ? 'background: var(--color-surface-brand)' : ''}">${markup}</div>`;

export default {
  title: 'Molecules/Check Item',
  render: (args) => frame(args, renderCheckList({ ...args, items: args.items.split('\n').filter(Boolean) })),
  argTypes: {
    items: { control: 'text', description: 'One item per line.' },
    tone: { control: 'inline-radio', options: CHECK_TONES, description: 'Figma Tone: Default, On brand (white text on a blue card).' },
  },
  args: { items: 'szef czuje się przeciążony i zagubiony w operacyjnym chaosie', tone: 'default' },
  parameters: {
    docs: {
      description: {
        component:
          '`ul.ds-check-list` (+ `ds-check-list--on-brand`) of `li.ds-check-item` = `svg.ds-check-item__icon` (27 px accent circle, tick in currentColor) + `span.ds-check-item__text`. Rows 12 px apart.',
      },
    },
  },
};

export const Default = {};
export const OnBrand = { name: 'On brand', args: { tone: 'on-brand' } };
export const List = {
  args: { items: 'szef czuje się przeciążony i zagubiony w operacyjnym chaosie\nzespół nie wie, jakie ma priorytety\nspotkania trwają za długo i nic z nich nie wynika' },
};
