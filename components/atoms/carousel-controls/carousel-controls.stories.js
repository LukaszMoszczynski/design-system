import { OVERVIEW_STATE, STATE_ARG_TYPES, forceState, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { renderCarouselArrow, renderCarouselControls, renderCarouselDot } from './carousel-controls.template.js';

const frame = (markup) => `<div style="padding: var(--space-24)">${markup}</div>`;
const ARROW = ['.ds-carousel-arrow'];
const DOT = ['.ds-carousel-dot'];

export default {
  title: 'Atoms/Carousel Controls',
  render: (args) => frame(renderCarouselControls(args)),
  argTypes: {
    count: { control: { type: 'number', min: 1, max: 20 }, description: 'Number of slides (dots).' },
    active: { control: { type: 'number', min: 0 }, description: 'Index of the current slide.' },
    counter: { control: 'boolean', description: 'Show „3 / 16” instead of the dots (when they do not fit).' },
    prevDisabled: { control: 'boolean' },
    nextDisabled: { control: 'boolean' },
    ...STATE_ARG_TYPES,
  },
  args: { count: 4, active: 0, counter: false, prevDisabled: false, nextDisabled: false, state: 'default' },
  parameters: {
    stateTargets: [...ARROW, ...DOT],
    docs: {
      description: {
        component:
          'Markup only; the carousel organism wires Swiper to `data-ds-carousel-prev`, `data-ds-carousel-next` and `data-ds-carousel-dots`. `.ds-carousel-arrow ds-carousel-arrow--{prev|next}`, `.ds-carousel-dot[aria-current="true"]`, `.ds-carousel-controls__counter`.',
      },
    },
  },
};

export const Playground = {};

// Figma Carousel/Arrow (Default, Hover, Focus, Disabled), Pagination/Dot (Default, Hover, Active) and the counter.
export const Overview = {
  ...OVERVIEW_STATE,
  render: () =>
    overviewGrid(
      [
        ...['default', 'hover', 'focus'].map((state) =>
          overviewCell(`arrow · ${state}`, frame(forceState(renderCarouselArrow({ direction: 'next' }), state, ARROW))),
        ),
        overviewCell('arrow · disabled', frame(renderCarouselArrow({ direction: 'prev', disabled: true }))),
        ...['default', 'hover'].map((state) => overviewCell(`dot · ${state}`, frame(forceState(renderCarouselDot({ index: 1 }), state, DOT)))),
        overviewCell('dot · active', frame(renderCarouselDot({ index: 0, active: true }))),
        overviewCell('counter', frame(renderCarouselControls({ count: 16, active: 2, counter: true })), true),
      ],
      '160px',
    ),
};
