import { overviewCell } from '../../../.storybook/state.js';
import { CARD_HEADING_TAGS } from '../../_shared/heading-tags.js';
import { renderCardIndustryStep } from './card-industry-step.template.js';

const card = (markup) => `<div style="width: var(--size-card-width); max-width: 100%">${markup}</div>`;
const frame = (markup) => `<div style="padding: var(--space-24) var(--space-48)">${card(markup)}</div>`;

export default {
  title: 'Molecules/Card Industry Step',
  render: (args) => frame(renderCardIndustryStep(args)),
  argTypes: {
    number: { control: 'text' },
    title: { control: 'text' },
    challengeTerm: { control: 'text' },
    challenge: { control: 'text' },
    actionTerm: { control: 'text' },
    action: { control: 'text' },
    active: { control: 'boolean', description: 'Figma State Active: the centred slide (set by the carousel).' },
    headingTag: { control: 'inline-radio', options: CARD_HEADING_TAGS },
  },
  args: {
    number: '01',
    title: 'Logistyka / magazyny / dystrybucja',
    challengeTerm: 'Wyzwanie:',
    challenge: 'napięcia między obszarami, brak spójnej współpracy przy dużej presji wyniku.',
    actionTerm: 'Działanie:',
    action: 'porządkujemy komunikację, role i odpowiedzialność, żeby zespół działał jako całość.',
    active: false,
    headingTag: 'h3',
  },
  parameters: {
    docs: {
      description: {
        component:
          '`article.ds-card-industry-step(.is-active)` > `div.ds-card-industry-step__card` (`h3.__title`, `p.__challenge`, `p.__action`) + `div.ds-card-industry-step__number` (Letter circle, industry). 413 px tall; the timeline is `::before`. Not a link: the industry carousel moves the active slide.',
      },
    },
  },
};

export const Playground = {};

// Figma Card/Industry step: State Default, Active, in a row as the carousel shows them (the timelines join).
export const Overview = {
  render: (args) =>
    `<div style="display: grid; grid-template-columns: repeat(3, var(--size-card-width)); gap: var(--space-gutter); padding: var(--space-24) var(--space-48); overflow-x: auto">${[
      overviewCell('default', renderCardIndustryStep(args)),
      overviewCell('active', renderCardIndustryStep({ ...args, number: '02', active: true })),
      overviewCell('default', renderCardIndustryStep({ ...args, number: '03' })),
    ].join('')}</div>`,
};
