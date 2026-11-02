import { renderCarouselArrow, renderCarouselControls, renderCarouselDot } from './carousel-controls.template.js';

const frame = (markup) => `<div style="padding: var(--space-24)">${markup}</div>`;

export default {
  title: 'Atoms/Carousel Controls',
  render: (args) => frame(renderCarouselControls(args)),
  argTypes: {
    count: { control: { type: 'number', min: 1, max: 20 }, description: 'Number of slides (dots).' },
    active: { control: { type: 'number', min: 0 }, description: 'Index of the current slide.' },
    counter: { control: 'boolean', description: 'Show „3 / 16” instead of the dots (when they do not fit).' },
    prevDisabled: { control: 'boolean' },
    nextDisabled: { control: 'boolean' },
  },
  args: { count: 4, active: 0, counter: false, prevDisabled: false, nextDisabled: false },
  parameters: {
    docs: {
      description: {
        component:
          'Markup only; the carousel organism wires Swiper to `data-ds-carousel-prev`, `data-ds-carousel-next` and `data-ds-carousel-dots`. `.ds-carousel-arrow ds-carousel-arrow--{prev|next}`, `.ds-carousel-dot[aria-current="true"]`, `.ds-carousel-controls__counter`.',
      },
    },
  },
};

export const Default = {};
export const Counter = { args: { count: 16, active: 2, counter: true } };

// Figma Carousel/Arrow: Default, Hover, Focus, Disabled.
export const Arrow = { render: () => frame(renderCarouselArrow({ direction: 'next' })) };
export const ArrowHover = { ...Arrow, parameters: { pseudo: { hover: ['.ds-carousel-arrow'] } } };
export const ArrowFocus = { ...Arrow, parameters: { pseudo: { focusVisible: ['.ds-carousel-arrow'] } } };
export const ArrowDisabled = { render: () => frame(renderCarouselArrow({ direction: 'prev', disabled: true })) };

// Figma Pagination/Dot: Default, Hover, Active.
export const Dot = { render: () => frame(renderCarouselDot({ index: 1 })) };
export const DotHover = { ...Dot, parameters: { pseudo: { hover: ['.ds-carousel-dot'] } } };
export const DotActive = { render: () => frame(renderCarouselDot({ index: 0, active: true })) };
