import { ACCORDION_LAYOUTS, DEFAULT_FAQ, renderAccordion, renderAccordionItem } from './accordion.template.js';
// Importing the script registers window.DS.accordion; the global decorator calls init(wrapper) after every render.
import './accordion.js';

const frame = (markup) => `<div style="padding: var(--space-24) var(--space-gutter)">${markup}</div>`;
const SUMMARY = ['.ds-accordion__summary'];

export default {
  title: 'Molecules/Accordion',
  render: (args) => frame(renderAccordion(args)),
  argTypes: {
    layout: { control: 'inline-radio', options: ACCORDION_LAYOUTS, description: 'Figma Accordion Layout: One column (tablet, phone), Two columns (desktop FAQ grid; stacks below 782 px).' },
    single: { control: 'boolean', description: 'data-ds-single: opening an item closes the others of the list (accordion.js).' },
    items: { control: 'object', description: '[{ question, answer, open? }]' },
  },
  args: { layout: 'one-column', single: false, items: DEFAULT_FAQ.slice(0, 4) },
  parameters: {
    docs: {
      description: {
        component:
          '`div.ds-accordion ds-accordion--{one-column|two-columns}[data-ds-accordion][data-ds-single?] > div.ds-accordion__column > details.ds-accordion__item > summary.ds-accordion__summary (span.ds-accordion__question + span.ds-accordion__icon with the plus and minus Icons) + div.ds-accordion__answer`. Native details: works without JS. Every item starts closed.',
      },
    },
  },
};

// Figma Accordion/Item states. Hover and Focus are forced on the question row.
const item = (args) => frame(`<div class="ds-accordion">${renderAccordionItem(args)}</div>`);
export const ItemCollapsed = { name: 'Item Collapsed', render: () => item({}) };
export const ItemHover = { name: 'Item Hover', render: () => item({}), globals: { pseudo: { hover: SUMMARY } } };
export const ItemFocus = { name: 'Item Focus', render: () => item({}), globals: { pseudo: { focusVisible: SUMMARY } } };
export const ItemExpanded = { name: 'Item Expanded', render: () => item({ open: true }) };

// Figma Accordion layouts (at rest: every item closed).
export const OneColumn = { name: 'One column' };
export const TwoColumns = { name: 'Two columns', args: { layout: 'two-columns', items: DEFAULT_FAQ } };
export const OneColumnMobile = { name: 'One column Mobile', globals: { viewport: { value: 'mobile', isRotated: false } } };
// One open item at a time: open one, then another.
export const Single = { args: { single: true } };
