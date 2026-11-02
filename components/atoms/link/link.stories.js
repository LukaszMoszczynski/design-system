import { LINK_KINDS, renderLink } from './link.template.js';

// Footer and Inverse are white links: their stories sit on the brand surface, as on the site.
const ON_BRAND = new Set(['footer', 'inverse']);
const frame = (kind, markup) =>
  ON_BRAND.has(kind)
    ? `<div style="display: inline-block; padding: var(--space-24); background: var(--color-surface-brand)">${markup}</div>`
    : `<div style="padding: var(--space-24)">${markup}</div>`;

function story(kind, state) {
  const result = { args: { kind } };
  if (state === 'hover') result.parameters = { pseudo: { hover: ['.ds-link'] } };
  if (state === 'focus') result.parameters = { pseudo: { focusVisible: ['.ds-link'] } };
  return result;
}

export default {
  title: 'Atoms/Link',
  render: (args) => frame(args.kind, renderLink(args)),
  argTypes: {
    text: { control: 'text' },
    href: { control: 'text' },
    kind: { control: 'select', options: LINK_KINDS, description: 'Figma Kind: Inline, Arrow, Brand, Footer, Bold, Inverse.' },
  },
  args: { text: 'Zobacz szczegóły', href: '#', kind: 'inline' },
  parameters: {
    docs: {
      description: {
        component:
          '`.ds-link ds-link--{kind}`; kinds with an arrow wrap the text in `.ds-link__label` and add `.ds-icon--arrow-diagonal`. Hover/Focus change the colour (except Brand and Inverse) and nudge the arrow; Focus adds the ring.',
      },
    },
  },
};

export const Inline = story('inline', 'default');
export const InlineHover = story('inline', 'hover');
export const InlineFocus = story('inline', 'focus');
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
