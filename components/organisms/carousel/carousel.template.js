// Carousel: a heading group, a row of slides and the carousel controls. Figma: Organisms → Carousel (12:807).
// DCC: dcc_carousel_open() / dcc_carousel_close() (inc/carousel.php), assets/js/carousel.js.
// The slides hold any card (Card/Program, Card/Tile, Card/Post…): `slides` is an array of markup strings, already
// rendered by the card templates. carousel.js wires window.Swiper to the data- hooks; without it the slides stay a
// scrollable row and the controls are hidden.
// items (Figma Items): whole cards per view from 1200 px. nav (Figma Navigation): below, beside-heading, above-right.
// pagination: dots (one per slide) or counter („3 / 16”, for long carousels on phones).
import { escapeHtml } from '../../_shared/escape.js';
import { renderCarouselControls } from '../../atoms/carousel-controls/carousel-controls.template.js';
import { renderHeadingGroup } from '../../molecules/heading-group/heading-group.template.js';

export const CAROUSEL_ITEMS = [2, 3, 4];
export const CAROUSEL_NAVS = ['below', 'beside-heading', 'above-right'];
export const CAROUSEL_PAGINATIONS = ['dots', 'counter'];

export const DEFAULT_CAROUSEL_HEADING = {
  overline: 'Szkolenia otwarte',
  title: 'Programy, które wybierają zespoły sprzedaży',
  lead: 'Warsztaty prowadzone przez praktyków: krótkie bloki teorii, dużo ćwiczeń i',
  leadStrong: 'przykłady z Waszej branży.',
};

// heading: the Heading group args, or null for a carousel without one. With nav above-right the group is split (the
// lead in the right column), as in Figma; a given heading.variant wins.
export function renderCarousel({
  slides = [],
  items = 3,
  nav = 'below',
  pagination = 'dots',
  heading = DEFAULT_CAROUSEL_HEADING,
  ariaLabel = '',
  id = '',
} = {}) {
  const itemCount = CAROUSEL_ITEMS.includes(Number(items)) ? Number(items) : 3;
  const navName = CAROUSEL_NAVS.includes(nav) ? nav : 'below';
  const paginationName = CAROUSEL_PAGINATIONS.includes(pagination) ? pagination : 'dots';
  const name = ariaLabel || heading?.title || 'Karuzela';
  const group = heading ? renderHeadingGroup({ variant: navName === 'above-right' ? 'split' : 'stacked', ...heading }) : '';
  const controls = `<div class="ds-carousel__nav">${renderCarouselControls({ count: slides.length, counter: paginationName === 'counter' })}</div>`;
  const head = group || navName === 'beside-heading' ? `<div class="ds-carousel__head">${group}${navName === 'beside-heading' ? controls : ''}</div>` : '';
  const list = slides.map((slide) => `<li class="ds-carousel__slide">${slide}</li>`).join('');
  const trackId = id ? ` id="${escapeHtml(id)}"` : '';
  const track = `<div class="ds-carousel__clip"><div class="ds-carousel__viewport"><ul class="ds-carousel__track" role="list"${trackId}>${list}</ul></div></div>`;
  const attributes = `data-ds-carousel data-ds-items="${itemCount}" data-ds-nav="${navName}" data-ds-pagination="${paginationName}" aria-roledescription="karuzela" aria-label="${escapeHtml(name)}"`;
  return `<section class="ds-carousel" ${attributes}>${head}${navName === 'above-right' ? controls : ''}${track}${navName === 'below' ? controls : ''}</section>`;
}
