import { STATE_ARG_TYPES, forceState, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { DEFAULT_CHALLENGES, renderAccordionChallenge, renderAccordionChallengeList } from './accordion-challenge.template.js';
// The accordion script animates the height with GSAP (and degrades without it).
import '../accordion/accordion.js';

const frame = (markup) => `<div style="padding: var(--space-24) var(--space-gutter)">${markup}</div>`;
const item = (args) => `<div class="ds-accordion-challenge-list">${renderAccordionChallenge(args)}</div>`;
const SUMMARY = ['.ds-accordion-challenge__summary'];

export default {
  title: 'Molecules/Accordion Challenge',
  render: (args) => frame(item(args)),
  argTypes: {
    question: { control: 'text' },
    answer: { control: 'text' },
    linkText: { control: 'text' },
    href: { control: 'text', description: 'Program link; empty leaves the link out.' },
    open: { control: 'boolean', description: 'Figma State Expanded (closed at rest).' },
    name: { control: 'text', description: 'Shared by the items of one list: the browser keeps one open.' },
    ...STATE_ARG_TYPES,
  },
  args: { ...DEFAULT_CHALLENGES[0], open: false, name: '', state: 'default' },
  parameters: {
    stateTargets: SUMMARY,
    docs: {
      description: {
        component:
          '`details.ds-accordion-challenge[name] > summary.ds-accordion-challenge__summary (span.ds-accordion-challenge__icon with the plus/minus Icons + span.ds-accordion-challenge__question) + div.ds-accordion-challenge__body (Text + Link inverse)`; list `div.ds-accordion-challenge-list`. Works without JS: the shared `name` makes it an exclusive accordion; `accordion/accordion.js` animates the height with GSAP. Figma Viewport=Mobile: the Mobile 390 viewport.',
      },
    },
  },
};

export const Playground = {};

// Figma Accordion/Challenge: Collapsed, Hover, Focus, Expanded, and a list.
export const Overview = {
  render: () =>
    overviewGrid(
      [
        overviewCell('Collapsed', item({})),
        overviewCell('Hover', forceState(item({}), 'hover', SUMMARY)),
        overviewCell('Focus', forceState(item({}), 'focus', SUMMARY)),
        overviewCell('Expanded', item({ open: true })),
        overviewCell('List', renderAccordionChallengeList()),
      ],
      '560px',
    ),
};
