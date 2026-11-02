import { STATE_ARG_TYPES, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { CARD_HEADING_TAGS } from '../card-program/card-program.template.js';
import { CARD_TRAINING_VARIANTS, renderCardTraining } from './card-training.template.js';
// The folded row animates its height with GSAP through the accordion script (and opens natively without it).
import '../accordion/accordion.js';

const WIDTHS = { carousel: '397px', column: '596px', featured: 'var(--size-card-width)', row: '318px' };
// The carousel card is white on the soft programs band.
const card = (variant, markup) =>
  `<div style="width: ${WIDTHS[variant] ?? WIDTHS.carousel}; max-width: 100%; ${variant === 'carousel' ? 'padding: var(--space-16); background: var(--color-surface-soft); border-radius: var(--card-radius)' : ''}">${markup}</div>`;
const frame = (variant, markup) => `<div style="padding: var(--space-24) var(--space-gutter)">${card(variant, markup)}</div>`;

export default {
  title: 'Molecules/Card Training',
  render: (args) => frame(args.variant, renderCardTraining(args)),
  argTypes: {
    variant: { control: 'inline-radio', options: CARD_TRAINING_VARIANTS, description: 'Figma Variant: Carousel, Column, Featured, Row (collapsed / expanded = open).' },
    label: { control: 'text', description: 'The accent label (Featured: the benefits pill).' },
    name: { control: 'text' },
    text: { control: 'text' },
    time: { control: 'text' },
    title: { control: 'text', description: 'Featured: the tab title.' },
    reasons: { control: 'object', description: 'Featured: check item texts.' },
    benefits: { control: 'object', description: 'Featured: benefit pills.' },
    buttonText: { control: 'text', description: 'Column and Row: the button.' },
    href: { control: 'text' },
    open: { control: 'boolean', description: 'Row: Figma Row expanded.' },
    headingTag: { control: 'inline-radio', options: CARD_HEADING_TAGS },
    ...STATE_ARG_TYPES,
  },
  args: {
    variant: 'carousel',
    label: 'Komunikacja i feedback',
    name: 'Trudne rozmowy w zespole',
    text: 'Jak mówić o błędach, oczekiwaniach i granicach tak, by relacja się nie posypała.',
    time: 'Rekomendowany czas: 1 dzień',
    title: 'Szczególnie polecamy, gdy:',
    reasons: ['awansujesz specjalistów na liderów', 'zespół rośnie szybciej niż procesy', 'chcesz jednego standardu zarządzania'],
    benefits: ['Pewność w pierwszych rozmowach 1:1', 'Delegowanie bez mikrozarządzania', 'Feedback, który nie rani'],
    buttonText: 'Zapytaj o termin',
    href: '#kontakt',
    open: false,
    headingTag: 'h3',
    state: 'default',
  },
  parameters: {
    stateTargets: ['.ds-button', '.ds-card-training__summary'],
    docs: {
      description: {
        component:
          '`article.ds-card-training ds-card-training--{carousel|column|featured}` (label, `h3.__name`, `p.__text`, `p.__time`, Button in `div.__actions`; Featured: `div.__tab`, Check list, `p.__benefits-title`, outline Tags) or `details.ds-card-training--row` (`summary.__summary` with the plus/minus Icons, `div.__body`). State applies to the button or the row question.',
      },
    },
    // The label is accent text on the card (the DCC palette gap; see Atoms/Button).
    a11y: { test: 'todo' },
  },
};

export const Playground = {};

// Figma Card/Training: Variant Carousel, Column, Featured, Row collapsed, Row expanded.
export const Overview = {
  render: (args) =>
    overviewGrid(
      [
        overviewCell('carousel', card('carousel', renderCardTraining({ ...args, variant: 'carousel' }))),
        overviewCell('column', card('column', renderCardTraining({ ...args, variant: 'column' })), true),
        overviewCell('featured', card('featured', renderCardTraining({ ...args, variant: 'featured' }))),
        overviewCell('row collapsed', card('row', renderCardTraining({ ...args, variant: 'row' }))),
        overviewCell('row expanded', card('row', renderCardTraining({ ...args, variant: 'row', open: true }))),
      ],
      '400px',
    ),
};
