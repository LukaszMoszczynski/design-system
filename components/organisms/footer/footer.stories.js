import { CONTRAST_OFF } from '../../../.storybook/a11y.js';
import { OVERVIEW_STATE, STATE_ARG_TYPES, forceState, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { DEFAULT_FOOTER, FOOTER_TAGS, renderFooter } from './footer.template.js';

const frame = (markup) => `<div style="padding: var(--space-24) var(--space-gutter)">${markup}</div>`;
const LINKS = ['.ds-footer__column--menu li:first-child .ds-link', '.ds-footer__line-link:first-child', '.ds-footer__tag-link'];

export default {
  title: 'Organisms/Footer',
  render: (args) => frame(renderFooter(args)),
  argTypes: {
    newsletter: { control: 'object', description: '{ title, lead, action } or null (no panel).' },
    logo: { control: 'text', description: 'Logo image URL. Empty: the Figma placeholder block.' },
    logoAlt: { control: 'text' },
    homeHref: { control: 'text' },
    homeAriaLabel: { control: 'text' },
    badges: { control: 'object', description: '[{ src, alt }]: an entry without src is a placeholder.' },
    hashtag: { control: 'text' },
    hashtagHref: { control: 'text' },
    about: { control: 'text' },
    office: { control: 'object', description: '{ title, lines[] } (the address).' },
    contact: { control: 'object', description: '{ title, phone, email, social: [{ network, href }] }' },
    menu: { control: 'object', description: '{ title, items: [{ text, href }] } (a nav landmark).' },
    menuAriaLabel: { control: 'text' },
    services: { control: 'object', description: '{ title, items: [{ text, href }] }' },
    copyright: { control: 'text' },
    legal: { control: 'object', description: '[{ text, href }]' },
    tag: { control: 'inline-radio', options: FOOTER_TAGS, description: 'The root element: footer (contentinfo) or div.' },
    ...STATE_ARG_TYPES,
  },
  args: {
    newsletter: DEFAULT_FOOTER.newsletter,
    logo: '',
    logoAlt: '',
    homeHref: '/',
    homeAriaLabel: 'DCC Grygorcewicz — strona główna',
    badges: [{}, {}],
    hashtag: '#zdroweorganizacje',
    hashtagHref: '#',
    about: 'DCC Grygorcewicz: szkolenia, coaching i doradztwo dla liderów i zespołów. Od 2008 roku pomagamy firmom budować zdrowe organizacje.',
    office: DEFAULT_FOOTER.office,
    contact: DEFAULT_FOOTER.contact,
    menu: DEFAULT_FOOTER.menu,
    menuAriaLabel: 'Menu w stopce',
    services: DEFAULT_FOOTER.services,
    copyright: '© 2026 DCC Grygorcewicz. Wszystkie prawa zastrzeżone.',
    legal: DEFAULT_FOOTER.legal,
    tag: 'footer',
    state: 'default',
  },
  parameters: {
    stateTargets: LINKS,
    // DCC palette gap: white on the accent newsletter panel and the accent hover links on the blue card fail colour
    // contrast (as in Atoms/Link Footer). Colour-contrast is off (the DCC palette contrast is the owner's decision, .storybook/a11y.js); every other a11y rule fails CI.
    a11y: CONTRAST_OFF,
    docs: {
      description: {
        component:
          '`footer.ds-footer > div.ds-footer__card` > `div.ds-footer__newsletter` (`h2.ds-footer__newsletter-title`, `p.ds-footer__newsletter-lead`, `form.ds-footer__form` with the Newsletter field) + `div.ds-footer__grid` (`div.ds-footer__brand`: `a.ds-footer__logo`, `div.ds-footer__badges`, `p.ds-footer__tag`, `p.ds-footer__about`; `div.ds-footer__columns > div.ds-footer__row` with `.ds-footer__column--office` / `--contact` (Social row raised), then `.ds-footer__row--links` with `nav.ds-footer__column--menu` / `.ds-footer__column--services` (Link/Footer lists)) + `div.ds-footer__legal`. State applies to the first Menu link, the phone and the hashtag.',
      },
    },
  },
};

export const Playground = {};

// Figma Footer, Viewport=Desktop: at rest, and with the links hovered and focused (Viewport=Mobile: the Mobile story).
export const Overview = {
  ...OVERVIEW_STATE,
  render: (args) =>
    overviewGrid(
      ['default', 'hover', 'focus'].map((state) =>
        overviewCell(state, forceState(renderFooter({ ...args, tag: 'div', menuAriaLabel: `Menu w stopce (${state})` }), state, LINKS), true),
      ),
      '1352px',
    ),
};

// Figma Viewport=Mobile: everything stacked, every column open.
// The site gives the footer 12 px of page margin on phones (Figma: 366 px in a 390 px phone).
export const Mobile = {
  globals: { viewport: { value: 'mobile', isRotated: false } },
  render: (args) => `<div style="padding: var(--space-24) var(--space-12)">${renderFooter(args)}</div>`,
};
