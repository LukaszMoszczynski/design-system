import { SOCIAL_NETWORKS, SOCIAL_STYLES, renderSocialButton, renderSocialList } from './social-button.template.js';

// Raised buttons sit on a card, as in the footer and the contact block.
const frame = (args, markup) =>
  `<div style="display: inline-block; padding: var(--space-24); background: ${args.style === 'raised' ? 'var(--color-surface-card)' : 'var(--color-surface-page)'}">${markup}</div>`;

export default {
  title: 'Atoms/Social Button',
  render: (args) => frame(args, renderSocialButton(args)),
  argTypes: {
    network: { control: 'select', options: Object.keys(SOCIAL_NETWORKS), description: 'Figma Icon/Social Network.' },
    href: { control: 'text' },
    label: { control: 'text', description: 'aria-label; defaults to the network name.' },
    style: { control: 'inline-radio', options: SOCIAL_STYLES, description: 'Figma Style: Plain, Raised.' },
  },
  args: { network: 'linkedin', href: '#', label: '', style: 'plain' },
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
export const PlainHover = { parameters: { pseudo: { hover: ['.ds-social-button'] } } };
export const PlainFocus = { parameters: { pseudo: { focusVisible: ['.ds-social-button'] } } };
export const Raised = { args: { style: 'raised' } };
export const RaisedHover = { args: { style: 'raised' }, parameters: { pseudo: { hover: ['.ds-social-button'] } } };
export const RaisedFocus = { args: { style: 'raised' }, parameters: { pseudo: { focusVisible: ['.ds-social-button'] } } };

// Figma Icon/Social: the five network glyphs.
export const Networks = { render: (args) => frame(args, renderSocialList({ style: args.style })) };
