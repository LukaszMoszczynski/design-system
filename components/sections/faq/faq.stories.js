import { CONTRAST_OFF } from '../../../.storybook/a11y.js';
import { OVERVIEW_STATE, STATE_ARG_TYPES, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { DEFAULT_FAQ } from '../../molecules/accordion/accordion.template.js';
import { FAQ_HEADING_TAGS, FAQ_VARIANTS, renderFaq } from './faq.template.js';
// The scripts register window.DS.accordion (animated height, one open with single) and window.DS.reveal.
import '../../molecules/accordion/accordion.js';
import '../../base/reveal.js';

export default {
  title: 'Sections/FAQ',
  render: (args) => renderFaq(args),
  argTypes: {
    variant: { control: 'inline-radio', options: FAQ_VARIANTS, description: 'The Accordion layout: two columns (Figma Desktop) or one column (Figma Mobile).' },
    overline: { control: 'text' },
    title: { control: 'text' },
    lead: { control: 'text', description: 'Empty: none.' },
    items: { control: 'object', description: '[{ question, answer }]. Every item starts closed.' },
    single: { control: 'boolean', description: 'One item open at a time (accordion.js).' },
    headingTag: { control: 'inline-radio', options: FAQ_HEADING_TAGS },
    ...STATE_ARG_TYPES,
  },
  args: {
    variant: 'two-columns',
    overline: 'FAQ',
    title: 'Najczęstsze pytania',
    lead: 'Nie znalazłeś odpowiedzi? Napisz do nas, odpowiadamy w ciągu jednego dnia roboczego.',
    items: DEFAULT_FAQ,
    single: false,
    headingTag: 'h2',
    state: 'default',
  },
  parameters: {
    stateTargets: ['.ds-faq .ds-accordion-summary'],
    // DCC palette gap: the accent overline fails colour contrast on the page colour. Colour-contrast is off (the DCC palette contrast is the owner's decision, .storybook/a11y.js); every other a11y rule fails CI.
    a11y: CONTRAST_OFF,
    docs: {
      description: {
        component:
          '`section.ds-faq.ds-faq--{variant}` > `div.ds-faq__container` > `div.ds-faq__head[data-ds-reveal]` (Heading group) + `div.ds-accordion` (Accordion: `details.ds-details.ds-accordion__item` in one or two `.ds-accordion__column`). State applies to the question rows.',
      },
    },
  },
};

export const Playground = {};

// Figma Section/FAQ: Desktop (two columns) and Mobile (one column, also on a phone: the Mobile story of the Accordion).
export const Overview = {
  ...OVERVIEW_STATE,
  render: () => overviewGrid(FAQ_VARIANTS.slice().reverse().map((variant) => overviewCell(variant, renderFaq({ variant }), true)), '1240px'),
};

// Figma Viewport=Mobile: one list on a 390 px phone.
export const Mobile = {
  ...OVERVIEW_STATE,
  globals: { viewport: { value: 'mobile', isRotated: false } },
  render: () => renderFaq({ variant: 'one-column' }),
};
