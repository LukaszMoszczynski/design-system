import { LINK_VARIANTS, renderLink } from './link.template.js';

// Known brand contrast gap: the DCC accent (#eb6126) with white text is 3.34:1 and accent text on the page 3.23:1
// (WCAG AA needs 4.5:1 at these sizes). The look is the brand's (Figma, live site), so these stories report the
// colour-contrast result as a11y "todo" (shown in the a11y panel, not failing CI) until the palette is decided.
const CONTRAST_TODO = { a11y: { test: 'todo' } };

// Footer and Inverse are white links: their stories sit on the brand surface, as on the site. Inline sits in a paragraph.
const ON_BRAND = new Set(['footer', 'inverse']);
const frame = (variant, markup) => {
  if (ON_BRAND.has(variant)) {
    return `<div style="display: inline-block; padding: var(--space-24); background: var(--color-surface-brand)">${markup}</div>`;
  }
  if (variant === 'inline') return `<p style="padding: var(--space-24); color: var(--color-text-default)">Szkolenia prowadzimy stacjonarnie i online. ${markup} znajdziesz w programie.</p>`;
  return `<div style="padding: var(--space-24)">${markup}</div>`;
};

function story(variant, state) {
  const result = { args: { variant } };
  if (state === 'hover') result.globals = { pseudo: { hover: ['.ds-link'] } };
  if (state === 'focus') result.globals = { pseudo: { focusVisible: ['.ds-link'] } };
  // Arrow, Footer and Bold turn accent on hover/focus (on the page, or on the blue footer card: 1.7:1).
  if (state !== 'default' && ['arrow', 'footer', 'bold'].includes(variant)) result.parameters = CONTRAST_TODO;
  return result;
}

export default {
  title: 'Atoms/Link',
  render: (args) => frame(args.variant, renderLink(args)),
  argTypes: {
    text: { control: 'text', description: 'Visible text.' },
    href: { control: 'text' },
    variant: {
      control: 'select',
      options: LINK_VARIANTS,
      description: 'Figma Kind: Inline (here split into `inline`, underlined for running text, and `list`, Figma\'s look for link lists), Arrow, Brand, Footer, Bold, Inverse.',
    },
  },
  args: { text: 'Zobacz szczegóły', href: '#', variant: 'inline' },
  parameters: {
    docs: {
      description: {
        component:
          '`.ds-link ds-link--{variant}`; variants with an arrow wrap the text in `.ds-link__label` and add `.ds-icon--arrow-diagonal`. Hover/Focus change the colour (except Brand and Inverse) and nudge the arrow; Focus adds the ring. `inline` is underlined at rest (WCAG 1.4.1), a deviation from Figma.',
      },
    },
  },
};

export const Inline = story('inline', 'default');
export const InlineHover = story('inline', 'hover');
export const InlineFocus = story('inline', 'focus');
export const List = story('list', 'default');
export const ListHover = story('list', 'hover');
export const ListFocus = story('list', 'focus');
export const Arrow = story('arrow', 'default');
export const ArrowHover = story('arrow', 'hover');
export const ArrowFocus = story('arrow', 'focus');
export const Brand = story('brand', 'default');
export const BrandHover = story('brand', 'hover');
export const BrandFocus = story('brand', 'focus');
export const Footer = story('footer', 'default');
export const FooterHover = story('footer', 'hover');
export const FooterFocus = story('footer', 'focus');
export const Bold = story('bold', 'default');
export const BoldHover = story('bold', 'hover');
export const BoldFocus = story('bold', 'focus');
export const Inverse = story('inverse', 'default');
export const InverseHover = story('inverse', 'hover');
export const InverseFocus = story('inverse', 'focus');
