import { SOCIAL_ROW_VARIANTS, renderSocialRow } from './social-row.template.js';

// Raised sits on a card, as in the footer and the contact block.
const frame = (args, markup) =>
  `<div style="display: inline-block; padding: var(--space-24); background: ${args.variant === 'raised' ? 'var(--color-surface-card)' : 'var(--color-surface-page)'}">${markup}</div>`;

export default {
  title: 'Molecules/Social Row',
  render: (args) => frame(args, renderSocialRow(args)),
  argTypes: {
    variant: { control: 'inline-radio', options: SOCIAL_ROW_VARIANTS, description: 'Figma Style: Plain, Raised.' },
    items: { control: 'object', description: '[{ network, href, ariaLabel? }]' },
  },
  args: { variant: 'plain' },
  parameters: {
    docs: {
      description: {
        component: "`ul.ds-social-list` of Social button atoms, 4 px apart (the atom's `renderSocialList`). Default: LinkedIn, Facebook, Instagram, YouTube.",
      },
    },
  },
};

export const Plain = {};
export const Raised = { args: { variant: 'raised' } };
