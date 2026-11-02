import { STATE_ARG_TYPES, forceState, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { ACCORDION_LAYOUTS, DEFAULT_FAQ, renderAccordion, renderAccordionItem } from './accordion.template.js';
// Importing the script registers window.DS.accordion; the global decorator calls init(wrapper) after every render.
import './accordion.js';

const frame = (markup) => `<div style="padding: var(--space-24) var(--space-gutter)">${markup}</div>`;
const item = (args) => `<div class="ds-accordion">${renderAccordionItem(args)}</div>`;
const FIRST_SUMMARY = ['.ds-accordion__item:first-child .ds-accordion__summary'];

export default {
  title: 'Molecules/Accordion',
  render: (args) => frame(renderAccordion(args)),
  argTypes: {
    layout: { control: 'inline-radio', options: ACCORDION_LAYOUTS, description: 'Figma Accordion Layout: One column (tablet, phone), Two columns (desktop FAQ grid; stacks below 782 px).' },
    single: { control: 'boolean', description: 'data-ds-single: opening an item closes the others of the list (accordion.js).' },
    items: { control: 'object', description: '[{ question, answer, open? }] (open: Figma State Expanded).' },
    ...STATE_ARG_TYPES,
  },
  args: { layout: 'one-column', single: false, items: DEFAULT_FAQ.slice(0, 4), state: 'default' },
  parameters: {
    stateTargets: FIRST_SUMMARY,
    docs: {
      description: {
        component:
          '`div.ds-accordion ds-accordion--{one-column|two-columns}[data-ds-accordion][data-ds-single?] > div.ds-accordion__column > details.ds-accordion__item > summary.ds-accordion__summary (span.ds-accordion__question + span.ds-accordion__icon with the plus and minus Icons) + div.ds-accordion__answer`. Native details: works without JS. Every item starts closed. State applies to the first question row.',
      },
    },
  },
};

export const Playground = {};

// Figma Accordion/Item states side by side, then the Accordion layouts (at rest: every item closed).
export const Overview = {
  render: () =>
    overviewGrid(
      [
        overviewCell('Item Collapsed', item({})),
        overviewCell('Item Hover', forceState(item({}), 'hover', ['.ds-accordion__summary'])),
        overviewCell('Item Focus', forceState(item({}), 'focus', ['.ds-accordion__summary'])),
        overviewCell('Item Expanded', item({ open: true })),
        overviewCell('One column', renderAccordion({ items: DEFAULT_FAQ.slice(0, 3) })),
        overviewCell('Two columns', renderAccordion({ layout: 'two-columns' }), true),
      ],
      '560px',
    ),
};

// Behaviour: one open item at a time (click one question, then another).
export const SingleOpen = { name: 'Single open', args: { single: true } };
