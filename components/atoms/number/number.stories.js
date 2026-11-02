import { OVERVIEW_STATE, forceState, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { LETTER_VARIANTS, renderLetterCircle, renderPageNumber } from './number.template.js';

const frame = (markup) => `<div style="display: flex; gap: var(--space-16); align-items: center; padding: var(--space-24)">${markup}</div>`;

export default {
  title: 'Atoms/Number',
  render: (args) => frame(renderLetterCircle(args)),
  argTypes: {
    text: { control: 'text', description: 'The letter or digit.' },
    variant: { control: 'inline-radio', options: LETTER_VARIANTS, description: 'Figma Context: Step, Word, Industry.' },
    active: { control: 'boolean', description: 'Figma State=Active (`is-active`).' },
  },
  args: { text: 'E', variant: 'step', active: false },
  parameters: {
    docs: {
      description: {
        component:
          'Letter circle `.ds-letter-circle ds-letter-circle--{step|word|industry}` (+ `is-active`) and page number `.ds-page-number` (current = `aria-current="page"`, hover on the others).',
      },
    },
  },
};

export const Playground = {};

// Every letter circle, at rest and active, and the page numbers (current and hovered).
export const Overview = {
  ...OVERVIEW_STATE,
  render: (args) =>
    overviewGrid([
      ...LETTER_VARIANTS.flatMap((variant) =>
        [false, true].map((active) =>
          overviewCell(`${variant} · ${active ? 'active' : 'default'}`, frame(renderLetterCircle({ ...args, variant, active, text: variant === 'industry' ? '1' : args.text }))),
        ),
      ),
      overviewCell('page numbers · current 2', frame([1, 2, 3].map((number) => renderPageNumber({ text: String(number), current: number === 2 })).join(''))),
      overviewCell('page number · hover', frame(forceState(renderPageNumber({ text: '1' }), 'hover', ['.ds-page-number']))),
    ]),
};
