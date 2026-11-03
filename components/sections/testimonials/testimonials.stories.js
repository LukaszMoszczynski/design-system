import { OVERVIEW_STATE, STATE_ARG_TYPES, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { DEFAULT_TESTIMONIALS, TESTIMONIALS_HEADING_TAGS, renderTestimonials } from './testimonials.template.js';
// The scripts register window.DS.carousel (Swiper from window, the centre card active) and window.DS.reveal.
import '../../organisms/carousel/carousel.js';
import '../../base/reveal.js';

export default {
  title: 'Sections/Testimonials',
  render: (args) => renderTestimonials(args),
  argTypes: {
    overline: { control: 'text' },
    title: { control: 'text', description: 'Also the carousel region name unless ariaLabel is given.' },
    lead: { control: 'text', description: 'Empty: none (Figma has none).' },
    items: { control: 'object', description: '[{ quote, author, role, photo? }]. From 6 the carousel loops.' },
    photo: { control: 'text', description: 'The photo of every card without its own (placeholder).' },
    headingTag: { control: 'inline-radio', options: TESTIMONIALS_HEADING_TAGS },
    ariaLabel: { control: 'text', description: 'The carousel region name (default: the title).' },
    ...STATE_ARG_TYPES,
  },
  args: {
    overline: 'Rekomendacje',
    title: 'Co mówią nasi klienci o współpracy z DCC?',
    lead: '',
    items: DEFAULT_TESTIMONIALS,
    photo: './placeholders/avatar.svg',
    headingTag: 'h2',
    ariaLabel: '',
    state: 'default',
  },
  parameters: {
    stateTargets: ['.ds-testimonials .ds-carousel-arrow', '.ds-testimonials .ds-carousel-dot'],
    // DCC palette gaps: the accent overline and the muted dots fail colour contrast. Reported as a11y todo until the
    // palette is decided; tokens unchanged.
    a11y: { test: 'todo' },
    docs: {
      description: {
        component:
          '`section.ds-testimonials` > `div.ds-testimonials__container` > `div.ds-testimonials__head[data-ds-reveal]` (centred Heading group) + `section.ds-carousel[data-ds-centered]` (Card/Testimonial slides; carousel.js marks the centre `li.ds-carousel__slide.is-active`). State applies to the carousel controls.',
      },
    },
  },
};

export const Playground = {};

// Figma Section/Testimonials has one desktop layout: the carousel with the centre card active, and the three-card row
// with only three testimonials (nothing to slide). Each carousel region gets its own name (one landmark name per page).
export const Overview = {
  ...OVERVIEW_STATE,
  render: () =>
    overviewGrid(
      [
        overviewCell('Desktop: six testimonials, looping, the centre card active', renderTestimonials()),
        overviewCell('Three testimonials: all in view, nothing to slide (the controls hide)', renderTestimonials({ items: DEFAULT_TESTIMONIALS.slice(0, 3), ariaLabel: 'Trzy opinie klientów' })),
      ],
      '1240px',
    ),
};

// Figma Viewport=Mobile: one card with the next peeking, dots only.
export const Mobile = {
  ...OVERVIEW_STATE,
  globals: { viewport: { value: 'mobile', isRotated: false } },
};
