import { overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { BENEFITS_VARIANTS, renderBenefits } from './benefits.template.js';

const surface = (variant, markup) =>
  `<div style="max-width: var(--size-card-width); padding: var(--space-24); background: ${variant === 'on-brand' ? 'var(--color-surface-brand); color: var(--color-text-on-brand)' : 'var(--color-surface-soft)'}">${markup}</div>`;

export default {
  title: 'Molecules/Benefits',
  render: (args) => `<div style="padding: var(--space-24) var(--space-gutter)">${surface(args.variant, renderBenefits(args))}</div>`,
  argTypes: {
    title: { control: 'text', description: 'The pill title; empty hides it.' },
    items: { control: 'object', description: 'Benefit texts (outline pills).' },
    chevron: { control: 'boolean', description: 'The chevron after the title (Card/Recommendation).' },
    variant: { control: 'inline-radio', options: BENEFITS_VARIANTS, description: 'default, or on-brand for a blue card.' },
  },
  args: {
    title: '3 główne korzyści',
    items: ['jasność co do swojej roli i autonomii', 'odzyskana równowaga i energia', 'przestrzeń do rozmowy i wsparcia'],
    chevron: true,
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        component: '`div.ds-benefits ds-benefits--{default|on-brand}` > `p.ds-benefits__title` (+ chevron Icon) + `ul.ds-benefits__list` of Tag outline `li`. Used by Card/Recommendation and Card/Training Featured.',
      },
    },
    // On-brand puts white text on the accent pill (the DCC palette gap; see Atoms/Button).
    a11y: { test: 'todo' },
  },
};

export const Playground = {};

export const Overview = {
  render: (args) => overviewGrid(BENEFITS_VARIANTS.map((variant) => overviewCell(variant, surface(variant, renderBenefits({ ...args, variant })))), '384px'),
};
