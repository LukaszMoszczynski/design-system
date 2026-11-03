import { CONTRAST_OFF } from '../../../.storybook/a11y.js';
import { overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { CARD_HEADING_TAGS } from '../../_shared/heading-tags.js';
import { CARD_RECOMMENDATION_VARIANTS, renderCardRecommendation } from './card-recommendation.template.js';

const card = (markup) => `<div style="width: var(--size-card-width); max-width: 100%">${markup}</div>`;
const frame = (markup) => `<div style="padding: var(--space-48) var(--space-gutter) var(--space-24)">${card(markup)}</div>`;

export default {
  title: 'Molecules/Card Recommendation',
  render: (args) => frame(renderCardRecommendation(args)),
  argTypes: {
    variant: { control: 'inline-radio', options: CARD_RECOMMENDATION_VARIANTS, description: 'Figma Tone: Default (soft), Blue (the site .is-blue).' },
    title: { control: 'text' },
    badgeText: { control: 'text', description: 'Wording round the badge (its accessible name); empty hides the badge.' },
    reasons: { control: 'object', description: 'Check item texts.' },
    benefitsTitle: { control: 'text' },
    benefits: { control: 'object', description: 'Benefit pill texts.' },
    headingTag: { control: 'inline-radio', options: CARD_HEADING_TAGS },
  },
  args: {
    variant: 'default',
    title: 'Szczególnie polecamy, gdy:',
    badgeText: 'Ten program szczególnie polecamy',
    reasons: [
      'szef czuje się przeciążony i zagubiony w operacyjnym chaosie',
      'top lider odpowiada w firmie „za wszystko”',
      'występują stany obniżenia poczucia równowagi, autonomii i poziomu energii',
    ],
    benefitsTitle: '3 główne korzyści',
    benefits: ['jasność co do swojej roli i autonomii', 'odzyskana równowaga i energia', 'przestrzeń do rozmowy i wsparcia'],
    headingTag: 'h3',
  },
  parameters: {
    docs: {
      description: {
        component:
          '`article.ds-card-recommendation ds-card-recommendation--{default|blue}` > `div.__tab` (`h3.__title`) + Badge/Circular (check, `__badge`) + `div.__reasons` (Check item list) + the Benefits molecule. Not a link, no states.',
      },
    },
    // The Blue variant puts white text on the accent pill (the DCC palette gap; see Atoms/Button).
    a11y: CONTRAST_OFF,
  },
};

export const Playground = {};

// Figma Card/Recommendation: Tone (variant) Default, Blue.
export const Overview = {
  render: (args) =>
    `<div style="padding-top: var(--space-24)">${overviewGrid(
      CARD_RECOMMENDATION_VARIANTS.map((variant) => overviewCell(variant, card(renderCardRecommendation({ ...args, variant })))),
      '384px',
    )}</div>`,
};
