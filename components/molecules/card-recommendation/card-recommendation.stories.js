import { overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { CARD_HEADING_TAGS } from '../card-program/card-program.template.js';
import { CARD_RECOMMENDATION_TONES, renderCardRecommendation } from './card-recommendation.template.js';

const card = (markup) => `<div style="width: var(--size-card-width); max-width: 100%">${markup}</div>`;
const frame = (markup) => `<div style="padding: var(--space-48) var(--space-gutter) var(--space-24)">${card(markup)}</div>`;

export default {
  title: 'Molecules/Card Recommendation',
  render: (args) => frame(renderCardRecommendation(args)),
  argTypes: {
    tone: { control: 'inline-radio', options: CARD_RECOMMENDATION_TONES, description: 'Figma Tone: Default (soft), Blue (.is-blue).' },
    title: { control: 'text' },
    badgeText: { control: 'text', description: 'Wording round the badge (its accessible name); empty hides the badge.' },
    reasons: { control: 'object', description: 'Check item texts.' },
    benefitsLabel: { control: 'text' },
    benefits: { control: 'object', description: 'Benefit pill texts.' },
    headingTag: { control: 'inline-radio', options: CARD_HEADING_TAGS },
  },
  args: {
    tone: 'default',
    title: 'Szczególnie polecamy, gdy:',
    badgeText: 'Ten program szczególnie polecamy',
    reasons: [
      'szef czuje się przeciążony i zagubiony w operacyjnym chaosie',
      'top lider odpowiada w firmie „za wszystko”',
      'występują stany obniżenia poczucia równowagi, autonomii i poziomu energii',
    ],
    benefitsLabel: '3 główne korzyści',
    benefits: ['jasność co do swojej roli i autonomii', 'odzyskana równowaga i energia', 'przestrzeń do rozmowy i wsparcia'],
    headingTag: 'h3',
  },
  parameters: {
    docs: {
      description: {
        component:
          '`article.ds-card-recommendation ds-card-recommendation--{default|blue}` > `div.__tab` (`h3.__title`) + Badge/Circular (check, `__badge`) + `div.__reasons` (Check item list) + `p.__benefits-title` (chevron Icon) + `ul.__benefits` of Tag outline `li`. Not a link, no states.',
      },
    },
    // The Blue tone puts white text on the accent pill (the DCC palette gap; see Atoms/Button).
    a11y: { test: 'todo' },
  },
};

export const Playground = {};

// Figma Card/Recommendation: Tone Default, Blue.
export const Overview = {
  render: (args) =>
    `<div style="padding-top: var(--space-24)">${overviewGrid(
      CARD_RECOMMENDATION_TONES.map((tone) => overviewCell(tone, card(renderCardRecommendation({ ...args, tone })))),
      '384px',
    )}</div>`,
};
