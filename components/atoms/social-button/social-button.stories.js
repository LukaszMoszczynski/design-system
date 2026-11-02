import { SOCIAL_NETWORKS, SOCIAL_VARIANTS, renderSocialButton, renderSocialList } from './social-button.template.js';

// Raised buttons sit on a card, as in the footer and the contact block.
const frame = (args, markup) =>
  `<div style="display: inline-block; padding: var(--space-24); background: ${args.variant === 'raised' ? 'var(--color-surface-card)' : 'var(--color-surface-page)'}">${markup}</div>`;

export default {
  title: 'Atoms/Social Button',
  render: (args) => frame(args, renderSocialButton(args)),
  argTypes: {
    network: { control: 'select', options: Object.keys(SOCIAL_NETWORKS), description: 'Figma Icon/Social Network.' },
    href: { control: 'text' },
    ariaLabel: { control: 'text', description: 'Accessible name; defaults to the network name.' },
    variant: { control: 'inline-radio', options: SOCIAL_VARIANTS, description: 'Figma Style: Plain, Raised.' },
  },
  args: { network: 'linkedin', href: '#', ariaLabel: '', variant: 'plain' },
  parameters: {
    docs: {
      description: {
        component:
          '`a.ds-social-button` (+ `ds-social-button--raised`) with `svg.ds-social-button__icon`; a row is `ul.ds-social-list` (`renderSocialList`). Opens in a new tab (`target="_blank" rel="noopener"`).',
      },
    },
  },
};

export const Plain = {};
export const PlainHover = { globals: { pseudo: { hover: ['.ds-social-button'] } } };
export const PlainFocus = { globals: { pseudo: { focusVisible: ['.ds-social-button'] } } };
export const Raised = { args: { variant: 'raised' } };
export const RaisedHover = { args: { variant: 'raised' }, globals: { pseudo: { hover: ['.ds-social-button'] } } };
export const RaisedFocus = { args: { variant: 'raised' }, globals: { pseudo: { focusVisible: ['.ds-social-button'] } } };

// Figma Icon/Social: the five network glyphs.
export const Networks = { render: (args) => frame(args, renderSocialList({ variant: args.variant })) };
