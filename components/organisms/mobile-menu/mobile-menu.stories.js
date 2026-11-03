import { CONTRAST_OFF } from '../../../.storybook/a11y.js';
import { OVERVIEW_STATE, STATE_ARG_TYPES, forceState, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { DEFAULT_MOBILE_BUTTONS, DEFAULT_MOBILE_ITEMS, renderMobileMenu } from './mobile-menu.template.js';
// The Oferta row is a .ds-details: accordion.js animates it. The drawer itself is driven from the Header (its burger).
import '../../molecules/accordion/accordion.js';

const phone = (markup) => `<div style="width: min(var(--size-viewport), 100%); margin-inline: auto">${markup}</div>`;
const ROWS = ['.ds-mobile-menu__list > li:nth-child(2) .ds-mobile-menu__row'];

export default {
  title: 'Organisms/Mobile Menu',
  // The standalone drawer is shown open; inside the Header it starts hidden and mobile-menu.js opens it.
  render: (args) => phone(renderMobileMenu({ ...args, open: true })),
  argTypes: {
    items: { control: 'object', description: '[{ text, href, current?, offer?: { links: [{ text, href }], allText, allHref } }]' },
    buttons: { control: 'object', description: '[{ text, href }]: the first Accent, the others Primary, without the icon circle.' },
    ariaLabel: { control: 'text', description: 'The nav landmark name.' },
    id: { control: 'text' },
    ...STATE_ARG_TYPES,
  },
  args: { items: DEFAULT_MOBILE_ITEMS, buttons: DEFAULT_MOBILE_BUTTONS, ariaLabel: 'Menu', id: 'ds-mobile-menu', state: 'default' },
  parameters: {
    stateTargets: ROWS,
    // DCC palette gap: the accent „Zobacz całą ofertę”, hover rows and white on the Accent button fail colour contrast.
    // Colour-contrast is off (the DCC palette contrast is the owner's decision, .storybook/a11y.js); every other a11y rule fails CI.
    a11y: CONTRAST_OFF,
    docs: {
      description: {
        component:
          '`div.ds-mobile-menu[data-ds-mobile-menu][hidden]` > `nav.ds-mobile-menu__nav > ul.ds-mobile-menu__list > li` (`a.ds-mobile-menu__row.ds-mobile-menu__link`, or `details.ds-details.ds-mobile-menu__offer` with the Accordion summary `.ds-mobile-menu__row` and `ul.ds-mobile-menu__sublist` of `a.ds-mobile-menu__sublink` + `a.ds-mobile-menu__all`) + `div.ds-mobile-menu__footer` (Buttons). Opened from the Header’s burger (Header → Mobile). State applies to the O nas row.',
      },
    },
  },
};

export const Playground = {};

// Figma Mobile menu: Oferta open (its soft sub-list), a row at rest, hover and focus.
export const Overview = {
  ...OVERVIEW_STATE,
  render: (args) => {
    const menu = (id) => renderMobileMenu({ ...args, id, ariaLabel: `Menu (${id})`, open: true });
    const offerOpen = menu('ds-mobile-offer').replace('<details class="ds-details ds-mobile-menu__offer">', '<details class="ds-details ds-mobile-menu__offer" open>');
    return overviewGrid(
      [
        overviewCell('Oferta open', offerOpen),
        overviewCell('Row hover', forceState(menu('ds-mobile-hover'), 'hover', ROWS)),
        overviewCell('Row focus', forceState(menu('ds-mobile-focus'), 'focus', ROWS)),
      ],
      '390px',
    );
  },
};
