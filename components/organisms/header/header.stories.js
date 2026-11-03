import { CONTRAST_OFF } from '../../../.storybook/a11y.js';
import { OVERVIEW_STATE, STATE_ARG_TYPES, forceState, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { DEFAULT_HEADER_ITEMS, HEADER_TAGS, renderHeader } from './header.template.js';
// The scripts register window.DS.header (scrolled, Mega menu), window.DS.mobileMenu (burger, drawer) and
// window.DS.accordion (the drawer's Oferta row); the global decorator calls init(wrapper) after every render.
import './header.js';
import '../mobile-menu/mobile-menu.js';
import '../../molecules/accordion/accordion.js';

const frame = (markup) => `<div style="padding: var(--space-24) 0">${markup}</div>`;
const OFFER = ['.ds-header__item:first-child .ds-nav-link', '.ds-header__item:first-child .ds-header__toggle'];
// Overview headers are plain divs with their own ids and nav names (one banner, unique landmarks per page).
const header = (name, args = {}) => renderHeader({ tag: 'div', id: `ds-header-${name}`, navAriaLabel: `Menu główne (${name})`, ...args });

export default {
  title: 'Organisms/Header',
  render: (args) => frame(renderHeader(args)),
  argTypes: {
    items: { control: 'object', description: '[{ text, href, current?, mega? }]: mega adds the Mega menu caret toggle.' },
    ctaText: { control: 'text', description: 'Nav CTA label (the phone link).' },
    ctaHref: { control: 'text' },
    logo: { control: 'text', description: 'Logo image URL. Empty: the Figma placeholder block.' },
    logoAlt: { control: 'text' },
    homeHref: { control: 'text' },
    homeAriaLabel: { control: 'text', description: 'The logo link name.' },
    badge: { control: 'text', description: 'Badge image URL (hidden up to 1024 px). Empty: the placeholder.' },
    badgeAlt: { control: 'text' },
    navAriaLabel: { control: 'text' },
    megaToggleAriaLabel: { control: 'text' },
    burgerAriaLabel: { control: 'text' },
    open: { control: 'boolean', description: 'Figma State=Open: rendered with the Mega menu open (try the caret too).' },
    scrolled: { control: 'boolean', description: 'Figma State=Scrolled: rendered with is-scrolled (the script sets it once the page scrolls).' },
    tag: { control: 'inline-radio', options: HEADER_TAGS, description: 'The root element: header (the banner) or div.' },
    id: { control: 'text', description: 'Prefix of the panel ids ({id}-mega, {id}-menu).' },
    ...STATE_ARG_TYPES,
  },
  args: {
    items: DEFAULT_HEADER_ITEMS,
    ctaText: 'Dzwonię',
    ctaHref: 'tel:+48000000000',
    logo: '',
    logoAlt: '',
    homeHref: '/',
    homeAriaLabel: 'DCC Grygorcewicz — strona główna',
    badge: '',
    badgeAlt: 'Pozytywnie Rozwojowi',
    navAriaLabel: 'Menu główne',
    megaToggleAriaLabel: 'Pokaż menu oferty',
    burgerAriaLabel: 'Menu',
    open: false,
    scrolled: false,
    tag: 'header',
    id: 'ds-header',
    state: 'default',
  },
  parameters: {
    stateTargets: OFFER,
    // DCC palette gap: the accent hover / focus link and the page-colour „Dzwonię” on the accent pill fail colour
    // contrast (as in Atoms/Nav Link). Colour-contrast is off (the DCC palette contrast is the owner's decision, .storybook/a11y.js); every other a11y rule fails CI.
    a11y: CONTRAST_OFF,
    docs: {
      description: {
        component:
          '`header.ds-header[data-ds-header]` (`.is-scrolled`) > `div.ds-header__bar` > `div.ds-header__brand` (`a.ds-header__logo`, `.ds-header__badge`) + `nav.ds-header__nav > ul.ds-header__menu > li.ds-header__item` (Nav link + `button.ds-header__toggle[data-ds-mega-toggle][aria-controls]` + the Mega menu `[data-ds-mega]`, so focus goes from the toggle into the panel) + `div.ds-header__actions` (Nav CTA, Nav burger); then the Mobile menu (`[data-ds-mobile-menu]`). Up to 1024 px the burger replaces the navigation (Mobile story). State applies to the Oferta link and caret.',
      },
    },
  },
};

export const Playground = {};

// Figma Header: Default, Scrolled, Link states (Oferta hover, Szkolenia current, Metody focus), Open (Mega menu 12 px
// under the bar). Viewport=Mobile is the Mobile story.
export const Overview = {
  ...OVERVIEW_STATE,
  render: () =>
    overviewGrid(
      [
        overviewCell('Default', header('default'), true),
        overviewCell('Scrolled', header('scrolled', { scrolled: true }), true),
        overviewCell(
          'Link states',
          forceState(forceState(header('states'), 'hover', OFFER), 'focus', ['.ds-header__item:nth-child(3) .ds-nav-link']),
          true,
        ),
        overviewCell('Open', `<div style="min-height: calc(var(--size-160) * 5)">${header('open', { open: true })}</div>`, true),
      ],
      '1281px',
    ),
};

// Figma Viewport=Mobile: logo, „Dzwonię” and the burger; the burger opens the drawer (Mobile menu) under the bar.
export const Mobile = {
  globals: { viewport: { value: 'mobile', isRotated: false } },
  render: (args) => `${renderHeader(args)}<main style="padding: var(--space-24) var(--space-gutter)"><p>Treść strony pod nagłówkiem.</p></main>`,
};

// Behaviour: the header sticks to the top of a long page; scroll to see is-scrolled (the shadow tweens with GSAP).
export const OnAPage = {
  name: 'On a page',
  render: (args) =>
    `<div style="position: sticky; top: var(--space-20); z-index: 20">${renderHeader(args)}</div><main style="display: grid; gap: var(--space-24); padding: var(--space-48) var(--space-gutter); min-height: calc(var(--size-160) * 15)">${Array.from({ length: 12 }, (_, index) => `<p style="margin: 0">Akapit ${index + 1}: przewiń stronę, by zobaczyć cień nagłówka.</p>`).join('')}</main>`,
};
