import { PAGINATION_TYPES, renderPagination } from './pagination.template.js';

const frame = (markup) => `<div style="display: inline-block; padding: var(--space-24)">${markup}</div>`;

export default {
  title: 'Molecules/Pagination',
  render: (args) => frame(renderPagination(args)),
  argTypes: {
    type: { control: 'inline-radio', options: PAGINATION_TYPES, description: 'Figma Pagination Type (Dots, Counter) and Pagination/Pages.' },
    count: { control: { type: 'number', min: 1, max: 20 }, description: 'Slides (dots, counter) or pages.' },
    active: { control: { type: 'number', min: 0 }, description: 'Dots / counter: index of the current slide (0-based).' },
    current: { control: { type: 'number', min: 1 }, description: 'Pages: the current page (1-based).' },
    hrefPattern: { control: 'text', description: 'Pages: link pattern, {page} is replaced.' },
    ariaLabel: { control: 'text', description: 'Pages: name of the nav landmark.' },
    nextAriaLabel: { control: 'text' },
  },
  args: { type: 'dots', count: 5, active: 1, current: 1, hrefPattern: '/blog/page/{page}/', ariaLabel: 'Stronicowanie', nextAriaLabel: 'Następna strona' },
  parameters: {
    docs: {
      description: {
        component:
          'Dots and Counter print the Carousel controls atom (`.ds-carousel-controls`, hooks `data-ds-carousel-prev/next/dots`); the carousel organism drives them. Pages: `nav.ds-pagination ds-pagination--pages > ul.ds-pagination__list` of Page number atoms and `a.ds-pagination__next` (hidden on phones and on the last page).',
      },
    },
  },
};

export const Dots = {};
export const Counter = { args: { type: 'counter', count: 16, active: 2 } };
export const Pages = { args: { type: 'pages', count: 3, current: 1 } };
export const PagesMobile = { name: 'Pages Mobile', args: { type: 'pages', count: 3, current: 1 }, globals: { viewport: { value: 'mobile', isRotated: false } } };
export const PagesMiddle = { name: 'Pages (page 2 of 5)', args: { type: 'pages', count: 5, current: 2 } };
export const PagesNextHover = { name: 'Pages Next Hover', args: { type: 'pages', count: 3, current: 1 }, globals: { pseudo: { hover: ['.ds-pagination__next'] } } };
export const PagesNextFocus = { name: 'Pages Next Focus', args: { type: 'pages', count: 3, current: 1 }, globals: { pseudo: { focusVisible: ['.ds-pagination__next'] } } };
