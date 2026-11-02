import { overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { BADGE_ICONS, renderBadgeCircular } from './badge-circular.template.js';

// The badge sits over a photo or a coloured card; a soft or brand surface shows its card-colour disc.
const surface = (background, markup) => `<div style="display: inline-block; padding: var(--space-40); background: ${background}">${markup}</div>`;

export default {
  title: 'Molecules/Badge Circular',
  render: (args) => surface('var(--color-surface-soft)', renderBadgeCircular(args)),
  argTypes: {
    text: { control: 'text', description: 'The wording round the ring (also the accessible name).' },
    icon: { control: 'inline-radio', options: BADGE_ICONS, description: 'The glyph in the dot: arrow (Call to action), check (recommendation card).' },
    id: { control: 'text', description: 'Id of the text path; generated when empty.' },
    className: { control: 'text', description: 'Extra class of the placing component (it may resize or recolour the badge).' },
  },
  args: { text: 'Wyzwanie? Znajdziemy rozwiązanie', icon: 'arrow', id: '', className: '' },
  parameters: {
    docs: {
      description: {
        component:
          '`span.ds-badge-circular[role=img][aria-label]` = `svg.ds-badge-circular__ring` (disc `__disc`, `textPath` in `__text`, turning slowly unless reduced motion) + `span.ds-badge-circular__dot` with the diagonal arrow Icon. One variant.',
      },
    },
  },
};

export const Playground = {};

// One variant, on the surfaces it overlaps.
export const Overview = {
  render: (args) =>
    overviewGrid(
      [
        overviewCell('On a soft card', surface('var(--color-surface-soft)', renderBadgeCircular(args))),
        overviewCell('Check, on the brand surface', surface('var(--color-surface-brand)', renderBadgeCircular({ ...args, icon: 'check', text: 'Ten program szczególnie polecamy' }))),
      ],
      '240px',
    ),
};
