import { OVERVIEW_STATE, STATE_ARG_TYPES, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { renderCardPost } from '../../molecules/card-post/card-post.template.js';
import { renderCardProgram } from '../../molecules/card-program/card-program.template.js';
import { renderCardTile } from '../../molecules/card-tile/card-tile.template.js';
import { CAROUSEL_ITEMS, CAROUSEL_NAVS, CAROUSEL_PAGINATIONS, DEFAULT_CAROUSEL_HEADING, renderCarousel } from './carousel.template.js';
// Importing the script registers window.DS.carousel; the global decorator calls init(wrapper) after every render.
// Swiper is window.Swiper (.storybook/preview.js), as a site enqueues it.
import './carousel.js';

// Figma Card: the instance-swap slot shared by every slide.
const CARDS = {
  program: (index) => renderCardProgram({ title: ['Negocjacje handlowe', 'Sprzedaż doradcza', 'Obsługa trudnego klienta', 'Zarządzanie zespołem', 'Komunikacja w zespole', 'Insights Discovery'][index % 6] }),
  tile: (index) => renderCardTile({ title: ['Akredytacja Insights Discovery', 'Certyfikacja coachów', 'Akredytacja DISC'][index % 3] }),
  post: () => renderCardPost(),
};
const CAROUSEL_CARDS = Object.keys(CARDS);

// Overview cells: the container width, as on a page.
const contained = (markup) => `<div style="max-width: var(--size-container)">${markup}</div>`;
const slidesOf = (card, count) => Array.from({ length: count }, (_, index) => CARDS[card](index));
const frame = (markup) => `<div style="padding: var(--space-24) var(--space-gutter); max-width: var(--size-container); box-sizing: content-box; margin-inline: auto">${markup}</div>`;
const carousel = ({ card = 'program', slideCount = 6, heading = true, ...args }) =>
  renderCarousel({ ...args, slides: slidesOf(card, slideCount), heading: heading ? DEFAULT_CAROUSEL_HEADING : null });

export default {
  title: 'Organisms/Carousel',
  render: (args) => frame(carousel(args)),
  argTypes: {
    items: { control: 'inline-radio', options: CAROUSEL_ITEMS, description: 'Figma Items: whole cards per view from 1200 px (data-ds-items). Phones: one card and a peek.' },
    nav: { control: 'inline-radio', options: CAROUSEL_NAVS, description: 'Figma Navigation: below, beside-heading, above-right (data-ds-nav). Phones: always below.' },
    pagination: { control: 'inline-radio', options: CAROUSEL_PAGINATIONS, description: 'Dots (one per slide) or the „3 / 16” counter (data-ds-pagination).' },
    card: { control: 'inline-radio', options: CAROUSEL_CARDS, description: 'Figma Card (story only): the card every slide holds. Sections pass any card markup in `slides`.' },
    slideCount: { control: { type: 'range', min: 1, max: 16 }, description: 'Story only: number of slides. Loop only with more slides than items; with fewer the controls hide.' },
    heading: { control: 'boolean', description: 'Story only: with the Heading group (`heading` = its args, or null).' },
    ariaLabel: { control: 'text', description: 'The region name (default: the heading title).' },
    ...STATE_ARG_TYPES,
  },
  args: { items: 3, nav: 'below', pagination: 'dots', card: 'program', slideCount: 6, heading: true, ariaLabel: '', state: 'default' },
  parameters: {
    // DCC palette gap: the accent overline of the Heading group fails colour contrast (as in Molecules/Heading Group).
    // Reported as a11y todo (a11y panel, not failing CI) until the palette is decided; tokens are not changed here.
    // With colour contrast switched off every story passes the other axe rules.
    a11y: { test: 'todo' },
    stateTargets: ['[data-ds-carousel-next]', '.ds-carousel-dot:not([aria-current])'],
    docs: {
      description: {
        component:
          '`section.ds-carousel.ds-carousel--nav-{nav}[data-ds-carousel][data-ds-items][data-ds-nav][data-ds-pagination][aria-roledescription=karuzela][aria-label]` > `div.ds-carousel__head` (Heading group, + `div.ds-carousel__nav` beside heading) + `div.ds-carousel__clip > div.ds-carousel__viewport > ul.ds-carousel__track > li.ds-carousel__slide` (any card) + `div.ds-carousel__nav` (Carousel controls). carousel.js wires `window.Swiper`; without it the slides are a scrollable row. State applies to the next arrow and the dots.',
      },
    },
  },
};

export const Playground = {};

// Figma Carousel: Items 2/3/4 (columns) × Navigation Below / Beside heading / Above right (rows). Viewport=Mobile is
// the Mobile story.
export const Overview = {
  ...OVERVIEW_STATE,
  render: () =>
    overviewGrid(
      CAROUSEL_NAVS.flatMap((nav) => CAROUSEL_ITEMS.map((items) => overviewCell(`Items ${items} · ${nav}`, contained(carousel({ items, nav, ariaLabel: `Programy · ${items} · ${nav}` })), true))),
      '1240px',
    ),
};

// Figma Viewport=Mobile: one card with the next one peeking, nav below.
export const Mobile = {
  globals: { viewport: { value: 'mobile', isRotated: false } },
  args: { nav: 'beside-heading' },
};

// Other cards in the slot: Card/Tile three per view, Card/Post two per view with the counter.
export const OtherCards = {
  name: 'Other cards',
  ...OVERVIEW_STATE,
  render: () =>
    overviewGrid(
      [
        overviewCell('Card/Tile · Items 3', contained(carousel({ card: 'tile', items: 3, nav: 'above-right', ariaLabel: 'Akredytacje' })), true),
        overviewCell('Card/Post · Items 2 · counter', contained(carousel({ card: 'post', items: 2, slideCount: 8, pagination: 'counter', heading: false, ariaLabel: 'Najnowsze wpisy' })), true),
      ],
      '1240px',
    ),
};
