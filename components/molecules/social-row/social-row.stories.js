import { OVERVIEW_STATE, STATE_ARG_TYPES, forceState, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { SOCIAL_ROW_VARIANTS, renderSocialRow } from './social-row.template.js';

// Raised sits on a card, as in the footer and the contact block.
const surface = (variant, markup) =>
  `<div style="display: inline-block; padding: var(--space-24); background: ${variant === 'raised' ? 'var(--color-surface-card)' : 'var(--color-surface-page)'}">${markup}</div>`;
const FIRST_BUTTON = ['li:first-child .ds-social-button'];

export default {
  title: 'Molecules/Social Row',
  render: (args) => surface(args.variant, renderSocialRow(args)),
  argTypes: {
    variant: { control: 'inline-radio', options: SOCIAL_ROW_VARIANTS, description: 'Figma Style: Plain, Raised.' },
    items: { control: 'object', description: '[{ network, href, ariaLabel? }]' },
    ...STATE_ARG_TYPES,
  },
  args: { variant: 'plain', state: 'default' },
  parameters: {
    stateTargets: FIRST_BUTTON,
    docs: {
      description: {
        component: "`ul.ds-social-list` of Social button atoms, 4 px apart (the atom's `renderSocialList`). Default: LinkedIn, Facebook, Instagram, YouTube. State applies to the first button.",
      },
    },
  },
};

export const Playground = {};

// Figma Style Plain, Raised; the first button hovered beside each.
export const Overview = {
  ...OVERVIEW_STATE,
  render: () =>
    overviewGrid(
      SOCIAL_ROW_VARIANTS.flatMap((variant) => [
        overviewCell(variant, surface(variant, renderSocialRow({ variant }))),
        overviewCell(`${variant}, first hover`, surface(variant, forceState(renderSocialRow({ variant }), 'hover', FIRST_BUTTON))),
      ]),
    ),
};
