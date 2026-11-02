import { TAG_VARIANTS, renderTag } from './tag.template.js';

// White-on-colour variants sit on the surface they are used on.
const BACKDROPS = {
  white: 'var(--color-surface-muted)',
  'article-white': 'var(--color-surface-muted)',
  soft: 'var(--color-surface-card)',
  hashtag: 'var(--color-surface-brand)',
};

export default {
  title: 'Atoms/Tag',
  render: (args) =>
    `<div style="display: inline-block; padding: var(--space-24); background: ${BACKDROPS[args.variant] ?? 'var(--color-surface-page)'}">${renderTag(args)}</div>`,
  argTypes: {
    text: { control: 'text' },
    variant: { control: 'select', options: TAG_VARIANTS, description: 'Figma Variant.' },
    tag: { control: 'inline-radio', options: ['span', 'li', 'time', 'a'], description: 'HTML element (li in a list of skills, time for a date).' },
  },
  args: { text: 'Przetestowany', variant: 'soft', tag: 'span' },
  parameters: {
    docs: { description: { component: '`.ds-tag ds-tag--{variant}`. Static, no states.' } },
  },
};

export const Soft = {};
export const White = { args: { variant: 'white', text: '12 października 2026', tag: 'time' } };
export const Brand = { args: { variant: 'brand' } };
export const Outline = { args: { variant: 'outline' } };
export const BrandSmall = { args: { variant: 'brand-small' } };
export const Article = { args: { variant: 'article' } };
export const ArticleWhite = { args: { variant: 'article-white' } };
export const Hashtag = { args: { variant: 'hashtag', text: '#PozytywnieRozwojowi' } };
