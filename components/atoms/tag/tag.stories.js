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
    href: { control: 'text', description: 'With a URL the tag is a link (`<a href>`).' },
    datetime: { control: 'text', description: 'Machine date: the tag is a `<time datetime>` (the post date).' },
    tag: { control: 'inline-radio', options: ['span', 'li'], description: 'Element when there is no href or datetime (li in a list of skills).' },
  },
  args: { text: 'Przetestowany', variant: 'soft', href: '', datetime: '', tag: 'span' },
  parameters: {
    docs: { description: { component: '`.ds-tag ds-tag--{variant}`. Static, except as a link (`href`): focus ring and a hairline outline on hover.' } },
  },
};

export const Soft = {};
export const White = { args: { variant: 'white', text: '12 października 2026', datetime: '2026-10-12' } };
export const Brand = { args: { variant: 'brand' } };
export const Outline = { args: { variant: 'outline' } };
export const BrandSmall = { args: { variant: 'brand-small' } };
export const Article = { args: { variant: 'article' } };
export const ArticleWhite = { args: { variant: 'article-white' } };
export const Hashtag = { args: { variant: 'hashtag', text: '#PozytywnieRozwojowi' } };
export const Link = { args: { variant: 'article', text: 'Przywództwo', href: '/blog/przywodztwo/' } };
export const LinkHover = { ...Link, globals: { pseudo: { hover: ['.ds-tag'] } } };
export const LinkFocus = { ...Link, globals: { pseudo: { focusVisible: ['.ds-tag'] } } };
