import { HEADING_GROUP_LAYOUTS, HEADING_TAGS, renderHeadingGroup } from './heading-group.template.js';

const frame = (markup) => `<div style="padding: var(--space-24) var(--space-gutter); max-width: calc(var(--size-container) + 2 * var(--space-gutter))">${markup}</div>`;

export default {
  title: 'Molecules/Heading Group',
  render: (args) => frame(renderHeadingGroup(args)),
  argTypes: {
    layout: { control: 'inline-radio', options: HEADING_GROUP_LAYOUTS, description: 'Figma Layout: Stacked (792 px max), Split (desktop only, stacks below 1025 px), Centered.' },
    overline: { control: 'text', description: 'Figma Show overline / Overline; empty hides it. Starting with # keeps its case.' },
    title: { control: 'text' },
    lead: { control: 'text', description: 'Figma Show lead / Lead; empty (with leadStrong empty) hides it.' },
    leadStrong: { control: 'text', description: 'Bold closing sentence of the lead.' },
    tag: { control: 'inline-radio', options: HEADING_TAGS, description: 'HTML level of the title (the look stays 3XL).' },
  },
  args: {
    layout: 'stacked',
    overline: 'Szkolenia otwarte',
    title: 'Programy, które wybierają zespoły sprzedaży',
    lead: 'Warsztaty prowadzone przez praktyków: krótkie bloki teorii, dużo ćwiczeń i',
    leadStrong: 'przykłady z Waszej branży.',
    tag: 'h2',
  },
  parameters: {
    docs: {
      description: {
        component:
          '`header.ds-heading-group ds-heading-group--{stacked|split|centered}` with three Text atoms: `ds-heading-group__overline` (overline, accent; `is-hashtag` for a # overline), `ds-heading-group__title` (3XL) and `ds-heading-group__lead` (body, muted; text colour in Split). Figma Viewport=Mobile is the Stacked story in the Mobile 390 viewport.',
      },
    },
    // The overline is accent text on the page (3.23:1, the DCC palette gap; see Atoms/Button).
    a11y: { test: 'todo' },
  },
};

export const Stacked = {};
export const Split = { args: { layout: 'split' } };
export const Centered = { args: { layout: 'centered' } };
export const StackedMobile = { name: 'Stacked Mobile', globals: { viewport: { value: 'mobile', isRotated: false } } };
export const Hashtag = { args: { overline: '#PozytywnieRozwojowi' } };
// No overline, so no accent text: checked at error level.
export const TitleOnly = { args: { overline: '', lead: '', leadStrong: '' }, parameters: { a11y: { test: 'error' } } };
