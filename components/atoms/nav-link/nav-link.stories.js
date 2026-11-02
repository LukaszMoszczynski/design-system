import { OVERVIEW_STATE, STATE_ARG_TYPES, forceState, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { renderNavBurger, renderNavCta, renderNavLink } from './nav-link.template.js';

// Known brand contrast gap: the DCC accent (#eb6126) with white text is 3.34:1 and accent text on the page 3.23:1
// (WCAG AA needs 4.5:1 at these sizes). The look is the brand's (Figma, live site). The nav link turns accent on
// hover/focus and the call button is accent, so the Overview reports the colour-contrast result as a11y "todo"
// (shown in the a11y panel, not failing CI) until the palette is decided.
const CONTRAST_TODO = { a11y: { test: 'todo' } };

const frame = (markup) => `<div style="padding: var(--space-24)">${markup}</div>`;

export default {
  title: 'Atoms/Nav Link',
  render: (args) => frame(renderNavLink(args)),
  argTypes: {
    text: { control: 'text', description: 'Visible text.' },
    href: { control: 'text' },
    current: { control: 'boolean', description: 'Figma State=Current (aria-current="page").' },
    ...STATE_ARG_TYPES,
  },
  args: { text: 'Oferta', href: '#', current: false, state: 'default' },
  parameters: {
    stateTargets: ['.ds-nav-link'],
    docs: {
      description: {
        component:
          'Header navigation atoms: `.ds-nav-link` (Default, Hover, Focus, Current), `.ds-nav-cta` (Desktop/Mobile, Hover) and `.ds-nav-burger` (Closed/Open via aria-expanded). The Mobile CTA is the Mobile 390 viewport.',
      },
    },
  },
};

export const Playground = {};

// The link at rest, hover, focus and current; the call button at rest and hover; the burger closed and open.
export const Overview = {
  ...OVERVIEW_STATE,
  parameters: { ...OVERVIEW_STATE.parameters, ...CONTRAST_TODO },
  render: (args) =>
    overviewGrid([
      ...['default', 'hover', 'focus'].map((state) => overviewCell(`link · ${state}`, frame(forceState(renderNavLink({ ...args, current: false }), state, ['.ds-nav-link'])))),
      overviewCell('link · current', frame(renderNavLink({ ...args, current: true }))),
      overviewCell('call · default', frame(renderNavCta())),
      overviewCell('call · hover', frame(forceState(renderNavCta(), 'hover', ['.ds-nav-cta']))),
      overviewCell('burger · closed', frame(renderNavBurger())),
      overviewCell('burger · open', frame(renderNavBurger({ open: true }))),
    ]),
};
