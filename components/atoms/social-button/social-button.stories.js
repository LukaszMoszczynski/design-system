import { OVERVIEW_STATE, STATE_ARG_TYPES, forceState, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { SOCIAL_NETWORKS, SOCIAL_VARIANTS, renderSocialButton, renderSocialList } from './social-button.template.js';

// Raised buttons sit on a card, as in the footer and the contact block.
const frame = (variant, markup) =>
  `<div style="display: inline-block; padding: var(--space-24); background: ${variant === 'raised' ? 'var(--color-surface-card)' : 'var(--color-surface-page)'}">${markup}</div>`;
const BUTTON = ['.ds-social-button'];

export default {
  title: 'Atoms/Social Button',
  render: (args) => frame(args.variant, renderSocialButton(args)),
  argTypes: {
    network: { control: 'select', options: Object.keys(SOCIAL_NETWORKS), description: 'Figma Icon/Social Network.' },
    href: { control: 'text' },
    ariaLabel: { control: 'text', description: 'Accessible name; defaults to the network name.' },
    variant: { control: 'inline-radio', options: SOCIAL_VARIANTS, description: 'Figma Style: Plain, Raised.' },
    ...STATE_ARG_TYPES,
  },
  args: { network: 'linkedin', href: '#', ariaLabel: '', variant: 'plain', state: 'default' },
  parameters: {
    stateTargets: BUTTON,
    docs: {
      description: {
        component:
          '`a.ds-social-button` (+ `ds-social-button--raised`) with `svg.ds-social-button__icon`; a row is `ul.ds-social-list` (`renderSocialList`). Opens in a new tab (`target="_blank" rel="noopener"`).',
      },
    },
  },
};

export const Playground = {};

// Both styles, at rest, hover and focus, then the five network glyphs in a row.
export const Overview = {
  ...OVERVIEW_STATE,
  render: (args) =>
    overviewGrid(
      [
        ...SOCIAL_VARIANTS.flatMap((variant) =>
          ['default', 'hover', 'focus'].map((state) =>
            overviewCell(`${variant} · ${state}`, frame(variant, forceState(renderSocialButton({ ...args, variant }), state, BUTTON))),
          ),
        ),
        ...SOCIAL_VARIANTS.map((variant) => overviewCell(`${variant} · networks`, frame(variant, renderSocialList({ variant })), true)),
      ],
      '160px',
    ),
};
