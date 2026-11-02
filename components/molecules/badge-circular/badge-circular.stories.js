import { renderBadgeCircular } from './badge-circular.template.js';

// The badge sits over a photo or a coloured card; the soft surface shows its card-colour disc.
const frame = (markup) => `<div style="display: inline-block; padding: var(--space-40); background: var(--color-surface-soft)">${markup}</div>`;

export default {
  title: 'Molecules/Badge Circular',
  render: (args) => frame(renderBadgeCircular(args)),
  argTypes: {
    text: { control: 'text', description: 'The wording round the ring (also the accessible name).' },
    id: { control: 'text', description: 'Id of the text path; generated when empty.' },
  },
  args: { text: 'Wyzwanie? Znajdziemy rozwiązanie', id: '' },
  parameters: {
    docs: {
      description: {
        component:
          '`span.ds-badge-circular[role=img][aria-label]` = `svg.ds-badge-circular__ring` (disc `__disc`, `textPath` in `__text`, turning slowly unless reduced motion) + `span.ds-badge-circular__dot` with the diagonal arrow Icon. One variant.',
      },
    },
  },
};

export const Default = {};
