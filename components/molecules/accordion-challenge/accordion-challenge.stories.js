import { DEFAULT_CHALLENGES, renderAccordionChallenge, renderAccordionChallengeList } from './accordion-challenge.template.js';

const frame = (markup) => `<div style="padding: var(--space-24) var(--space-gutter)">${markup}</div>`;
const item = (args) => frame(`<div class="ds-accordion-challenge-list">${renderAccordionChallenge(args)}</div>`);
const MOBILE = { viewport: { value: 'mobile', isRotated: false } };

export default {
  title: 'Molecules/Accordion Challenge',
  render: (args) => item(args),
  argTypes: {
    question: { control: 'text' },
    answer: { control: 'text' },
    linkText: { control: 'text' },
    href: { control: 'text', description: 'Program link; empty leaves the link out.' },
    open: { control: 'boolean', description: 'Figma State Expanded (stories start closed).' },
    name: { control: 'text', description: 'Shared by the items of one list: the browser keeps one open.' },
  },
  args: { ...DEFAULT_CHALLENGES[0], open: false, name: '' },
  parameters: {
    docs: {
      description: {
        component:
          '`details.ds-accordion-challenge[name] > summary.ds-accordion-challenge__summary (span.ds-accordion-challenge__icon with the plus/minus Icons + span.ds-accordion-challenge__question) + div.ds-accordion-challenge__body (Text + Link inverse)`; list `div.ds-accordion-challenge-list`. No JS: the shared `name` makes it an exclusive accordion.',
      },
    },
  },
};

// Figma Accordion/Challenge: Desktop Collapsed, Hover, Expanded; Mobile Collapsed, Expanded.
export const Collapsed = {};
export const Hover = { globals: { pseudo: { hover: ['.ds-accordion-challenge__summary'] } } };
export const Focus = { globals: { pseudo: { focusVisible: ['.ds-accordion-challenge__summary'] } } };
export const Expanded = { args: { open: true } };
export const CollapsedMobile = { name: 'Collapsed Mobile', globals: MOBILE };
export const ExpandedMobile = { name: 'Expanded Mobile', args: { open: true }, globals: MOBILE };
export const List = { render: () => frame(renderAccordionChallengeList()) };
