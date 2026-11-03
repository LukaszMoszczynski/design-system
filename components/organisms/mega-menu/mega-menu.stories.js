import { CONTRAST_OFF } from '../../../.storybook/a11y.js';
import { OVERVIEW_STATE, STATE_ARG_TYPES, forceState, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { DEFAULT_AREAS, DEFAULT_BESTSELLERS, DEFAULT_SHOP, renderMegaMenu } from './mega-menu.template.js';

const frame = (markup) => `<div style="padding: var(--space-24) var(--space-gutter)">${markup}</div>`;
const FIRST_LINKS = ['.ds-mega-menu__area:first-child .ds-mega-menu__link', '.ds-mega-menu__area:first-child .ds-mega-menu__all'];

export default {
  title: 'Organisms/Mega Menu',
  // The standalone panel is shown open; inside the Header it starts hidden and header.js opens it.
  render: (args) => frame(renderMegaMenu({ ...args, open: true })),
  argTypes: {
    text: { control: 'text', description: 'The visible title above the bestsellers.' },
    bestsellers: { control: 'object', description: '[{ title, text, href }]' },
    areas: { control: 'object', description: '[{ name, links: [{ text, href }], href }]: href adds „Zobacz wszystkie”.' },
    allText: { control: 'text' },
    shop: { control: 'object', description: '{ title, text, buttonText, href } or null.' },
    id: { control: 'text' },
    ...STATE_ARG_TYPES,
  },
  args: { text: 'Szczególnie polecamy', bestsellers: DEFAULT_BESTSELLERS, areas: DEFAULT_AREAS, allText: 'Zobacz wszystkie', shop: DEFAULT_SHOP, id: 'ds-mega-menu', state: 'default' },
  parameters: {
    stateTargets: FIRST_LINKS,
    // DCC palette gap: the accent bestsellers title and the accent hover / focus links fail colour contrast. Colour-contrast is off (the DCC palette contrast is the owner's decision, .storybook/a11y.js); every other a11y rule fails CI.
    a11y: CONTRAST_OFF,
    docs: {
      description: {
        component:
          '`div.ds-mega-menu[data-ds-mega][hidden]` > `div.ds-mega-menu__bestsellers` (`p.ds-mega-menu__label`, `ul.ds-mega-menu__bestseller-list > li > a.ds-mega-menu__bestseller` with `__bestseller-title` / `__bestseller-text`) + `ul.ds-mega-menu__areas > li.ds-mega-menu__area` (`p.ds-mega-menu__area-name`, `ul.ds-mega-menu__links a.ds-mega-menu__link`, `a.ds-mega-menu__all`) + `div.ds-mega-menu__shop` (text + Button light pill). Opened by the Header. State applies to the first area’s links.',
      },
    },
  },
};

export const Playground = {};

// Figma Mega menu: one variant; link at rest, hover and focus side by side.
export const Overview = {
  ...OVERVIEW_STATE,
  render: (args) =>
    overviewGrid(
      ['default', 'hover', 'focus'].map((state) => overviewCell(`Links ${state}`, forceState(renderMegaMenu({ ...args, id: `ds-mega-${state}`, open: true }), state, FIRST_LINKS))),
      '880px',
    ),
};
