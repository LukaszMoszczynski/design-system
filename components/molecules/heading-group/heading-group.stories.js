import { CONTRAST_OFF } from '../../../.storybook/a11y.js';
import { overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { HEADING_GROUP_VARIANTS, HEADING_TAGS, renderHeadingGroup } from './heading-group.template.js';

const frame = (markup) => `<div style="padding: var(--space-24) var(--space-gutter); max-width: calc(var(--size-container) + 2 * var(--space-gutter))">${markup}</div>`;

export default {
  title: 'Molecules/Heading Group',
  render: (args) => frame(renderHeadingGroup(args)),
  argTypes: {
    variant: { control: 'inline-radio', options: HEADING_GROUP_VARIANTS, description: 'Figma Layout: Stacked (792 px max), Split (desktop only, stacks below 1025 px), Centered.' },
    overline: { control: 'text', description: 'Figma Show overline / Overline; empty hides it. Starting with # keeps its case.' },
    title: { control: 'text' },
    lead: { control: 'text', description: 'Figma Show lead / Lead; empty (with leadStrong empty) hides it.' },
    leadStrong: { control: 'text', description: 'Bold closing sentence of the lead.' },
    headingTag: { control: 'inline-radio', options: HEADING_TAGS, description: 'HTML level of the title (the look stays 3XL).' },
  },
  args: {
    variant: 'stacked',
    overline: 'Szkolenia otwarte',
    title: 'Programy, które wybierają zespoły sprzedaży',
    lead: 'Warsztaty prowadzone przez praktyków: krótkie bloki teorii, dużo ćwiczeń i',
    leadStrong: 'przykłady z Waszej branży.',
    headingTag: 'h2',
  },
  parameters: {
    docs: {
      description: {
        component:
          '`header.ds-heading-group ds-heading-group--{stacked|split|centered}` with three Text atoms: `ds-heading-group__overline` (overline, accent; `is-hashtag` for a # overline), `ds-heading-group__title` (3XL) and `ds-heading-group__lead` (body, muted; text colour in Split). Figma Viewport=Mobile: the same markup in the Mobile 390 viewport.',
      },
    },
    // The overline is accent text on the page (3.23:1, the DCC palette gap; see Atoms/Button).
    a11y: CONTRAST_OFF,
  },
};

export const Playground = {};

// Figma Layout Stacked, Split, Centered, plus the hashtag overline.
// Each one sits in a <section>, as on a page (Carousel, FAQ, Testimonials, Text + image): the <header> of a Heading group
// outside sectioning content (section, article, aside, nav, main) is a banner landmark, and four of them side by side failed
// axe landmark-no-duplicate-banner and landmark-unique.
const inSection = (markup) => `<section>${markup}</section>`;
export const Overview = {
  render: (args) =>
    overviewGrid(
      [
        overviewCell('Stacked', inSection(renderHeadingGroup(args))),
        overviewCell('Split', inSection(renderHeadingGroup({ ...args, variant: 'split' }))),
        overviewCell('Centered', inSection(renderHeadingGroup({ ...args, variant: 'centered' }))),
        overviewCell('Stacked, # overline, no lead', inSection(renderHeadingGroup({ ...args, overline: '#PozytywnieRozwojowi', lead: '', leadStrong: '' }))),
      ],
      '100%',
    ),
};
