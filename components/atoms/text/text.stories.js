import { OVERVIEW_STATE, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { TEXT_TAGS, TEXT_TONES, TEXT_VARIANTS, renderText } from './text.template.js';

const SAMPLES = {
  number: '1500',
  button: 'Poznaj ofertę',
  question: 'Jak wygląda pierwsze spotkanie?',
  overline: 'Szkolenia dla firm',
};

export default {
  title: 'Atoms/Text',
  render: (args) => `<div style="padding: var(--space-24)">${renderText(args)}</div>`,
  argTypes: {
    text: { control: 'text', description: 'Visible text.' },
    variant: { control: 'select', options: TEXT_VARIANTS, description: 'Figma Style. Desktop/Mobile come from the fluid tokens: resize the viewport.' },
    tone: { control: 'select', options: TEXT_TONES, description: 'Colour: inherit (default, from the surface) or a text token.' },
    tag: { control: 'select', options: TEXT_TAGS, description: 'HTML element; independent of the look.' },
  },
  args: { text: 'Rozwijamy liderów i zespoły', variant: 'body', tone: 'inherit', tag: 'p' },
  parameters: {
    docs: {
      description: {
        component:
          '`.ds-text ds-text--{variant}` (+ `ds-text--{default|muted|primary|accent|on-brand}` tone; colour is inherited without one). Size scale desktop → mobile: 4XL 56→32, 3XL 44→28, 2XL 32→24, XL 28→20, LG 20→16, Body 16, Small 12, Overline 20→12, Number 64, Button 20→16, Question 20→16. Figma Viewport=Mobile is the same story in the Mobile 390 viewport.',
      },
    },
  },
};

export const Playground = {};

// The whole ladder, as the Figma section shows it.
export const Overview = {
  ...OVERVIEW_STATE,
  render: (args) =>
    overviewGrid(
      TEXT_VARIANTS.map((variant) =>
        overviewCell(variant, renderText({ ...args, variant, tag: 'p', text: SAMPLES[variant] ?? args.text }), true),
      ),
    ),
};

// Tones: inherited on a blue surface, and the text tokens on the page. Accent text on the page is 3.23:1 (the brand
// contrast gap, see Atoms/Button): reported as a11y todo.
export const Tones = {
  ...OVERVIEW_STATE,
  parameters: { ...OVERVIEW_STATE.parameters, a11y: { test: 'todo' } },
  render: (args) =>
    overviewGrid([
      ...TEXT_TONES.map((tone) => overviewCell(tone, renderText({ ...args, tone, variant: 'lg', tag: 'p' }))),
      overviewCell(
        'on brand (inherited)',
        `<div style="padding: var(--space-24); background: var(--color-surface-brand); color: var(--color-text-on-brand)">${renderText({ ...args, variant: '2xl', tag: 'h2' })}</div>`,
      ),
    ]),
};
