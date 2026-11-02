import { overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { renderCardTestimonial } from './card-testimonial.template.js';

const card = (markup) => `<div style="width: var(--size-card-width); max-width: 100%">${markup}</div>`;
const frame = (markup) => `<div style="padding: var(--space-24) var(--space-gutter)">${card(markup)}</div>`;

export default {
  title: 'Molecules/Card Testimonial',
  render: (args) => frame(renderCardTestimonial(args)),
  argTypes: {
    quote: { control: 'text' },
    author: { control: 'text' },
    role: { control: 'text' },
    photo: { control: 'text', description: 'Author photo URL (48 px circle); empty hides it.' },
    active: { control: 'boolean', description: 'Figma State Active: the centre slide (set by the carousel).' },
  },
  args: {
    quote: 'Współpraca z DCC pomogła nam uporządkować komunikację w zespole i jasno podzielić odpowiedzialności. Warsztaty były konkretne, osadzone w naszej branży i od razu przełożyły się na codzienną pracę.',
    author: 'Agnieszka Nowicka-Petri',
    role: 'Dyrektor HR, Cardiac-Technika',
    photo: './placeholders/avatar.svg',
    active: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          '`figure.ds-card-testimonial(.is-active)` > `div.__top` (quote mark SVG, accent) + `blockquote.__quote` + `figcaption.__caption` (`img.__photo`, `span.__name` with the author and role Text atoms). Figma Viewport=Mobile: the Mobile 390 viewport.',
      },
    },
  },
};

export const Playground = {};

// Figma Card/Testimonial: State Default, Active.
export const Overview = {
  render: (args) =>
    overviewGrid(
      [overviewCell('default', card(renderCardTestimonial({ ...args, active: false }))), overviewCell('active', card(renderCardTestimonial({ ...args, active: true })))],
      '384px',
    ),
};
