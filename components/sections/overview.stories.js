// Sections/Overview: the four example sections stacked as one page, the place to judge the brand and theme switch.
import { renderFaq } from './faq/faq.template.js';
import { renderHero } from './hero/hero.template.js';
import { renderTestimonials } from './testimonials/testimonials.template.js';
import { renderTextImage } from './text-image/text-image.template.js';
// The scripts the page needs: the carousel (Swiper from window), the accordion and the scroll reveal.
import '../organisms/carousel/carousel.js';
import '../molecules/accordion/accordion.js';
import '../base/reveal.js';

export default {
  title: 'Sections/Overview',
  parameters: {
    // DCC palette gaps (accent text on the page and on the blue box): a11y todo, as on each section.
    a11y: { test: 'todo' },
    docs: { description: { component: 'Hero, Text + image, Testimonials and FAQ on one page. Switch Brand and Theme in the toolbar.' } },
  },
};

export const Overview = {
  render: () =>
    [
      renderHero({ variant: 'large', image: './placeholders/landscape.svg' }),
      renderTextImage({ variant: 'image-right', image: './placeholders/landscape.svg' }),
      renderTestimonials(),
      renderFaq(),
    ].join(''),
};
