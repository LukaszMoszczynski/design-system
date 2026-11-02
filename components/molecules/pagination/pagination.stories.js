import { OVERVIEW_STATE, STATE_ARG_TYPES, forceState, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { PAGINATION_VARIANTS, renderPagination } from './pagination.template.js';

const frame = (markup) => `<div style="display: inline-block; padding: var(--space-24)">${markup}</div>`;
// The state goes on the next control: the carousel's next arrow or the pages' next link.
const NEXT = ['.ds-carousel-arrow--next', '.ds-pagination__next'];

export default {
  title: 'Molecules/Pagination',
  render: (args) => frame(renderPagination(args)),
  argTypes: {
    variant: { control: 'inline-radio', options: PAGINATION_VARIANTS, description: 'Figma Pagination Type (Dots, Counter) and Pagination/Pages.' },
    count: { control: { type: 'number', min: 1, max: 20 }, description: 'Slides (dots, counter) or pages.' },
    active: { control: { type: 'number', min: 0 }, description: 'Dots / counter: index of the current slide (0-based).' },
    current: { control: { type: 'number', min: 1 }, description: 'Pages: the current page (1-based).' },
    hrefPattern: { control: 'text', description: 'Pages: link pattern, {page} is replaced.' },
    ariaLabel: { control: 'text', description: 'Pages: name of the nav landmark.' },
    nextAriaLabel: { control: 'text' },
    ...STATE_ARG_TYPES,
  },
  args: { variant: 'dots', count: 5, active: 1, current: 1, hrefPattern: '/blog/page/{page}/', ariaLabel: 'Stronicowanie', nextAriaLabel: 'Następna strona', state: 'default' },
  parameters: {
    stateTargets: NEXT,
    docs: {
      description: {
        component:
          'Dots and Counter print the Carousel controls atom (`.ds-carousel-controls`, hooks `data-ds-carousel-prev/next/dots`); the carousel organism drives them. Pages: `nav.ds-pagination ds-pagination--pages > ul.ds-pagination__list` of Page number atoms and `a.ds-pagination__next` (hidden on phones and on the last page). State applies to the next control.',
      },
    },
  },
};

export const Playground = {};

// Figma Pagination Dots, Counter and Pagination/Pages (Mobile: the Mobile 390 viewport), with the next control's states.
// Each nav gets its own name: landmarks on one page must be unique.
export const Overview = {
  ...OVERVIEW_STATE,
  render: () =>
    overviewGrid([
      overviewCell('Dots', renderPagination({ variant: 'dots', count: 5, active: 1 })),
      overviewCell('Counter', renderPagination({ variant: 'counter', count: 16, active: 2 })),
      overviewCell('Pages', renderPagination({ variant: 'pages', count: 3, current: 1, ariaLabel: 'Stronicowanie 1' })),
      overviewCell('Pages, page 2 of 5', renderPagination({ variant: 'pages', count: 5, current: 2, ariaLabel: 'Stronicowanie 2' })),
      overviewCell('Pages, next hover', forceState(renderPagination({ variant: 'pages', count: 3, current: 1, ariaLabel: 'Stronicowanie 3' }), 'hover', ['.ds-pagination__next'])),
      overviewCell('Pages, next focus', forceState(renderPagination({ variant: 'pages', count: 3, current: 1, ariaLabel: 'Stronicowanie 4' }), 'focus', ['.ds-pagination__next'])),
    ]),
};
