import { STATE_ARG_TYPES, forceState, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { BADGE_VARIANTS } from '../../atoms/badge-pill/badge-pill.template.js';
import { CARD_HEADING_TAGS } from '../card-program/card-program.template.js';
import { CARD_PRODUCT_VARIANTS, renderCardProduct } from './card-product.template.js';

const WIDTHS = { standard: 'var(--size-post-card-width)', compact: 'var(--size-post-card-width)', rows: 'var(--size-container)' };
const card = (variant, markup) => `<div style="width: ${WIDTHS[variant] ?? WIDTHS.standard}; max-width: 100%">${markup}</div>`;
const frame = (variant, markup) => `<div style="padding: var(--space-24) var(--space-gutter)">${card(variant, markup)}</div>`;
const CARD = ['.ds-card-product'];

export default {
  title: 'Molecules/Card Product',
  render: (args) => frame(args.variant, renderCardProduct(args)),
  argTypes: {
    variant: { control: 'inline-radio', options: CARD_PRODUCT_VARIANTS, description: 'Figma Variant: Standard, Compact, Rows.' },
    title: { control: 'text' },
    text: { control: 'text' },
    meta: { control: 'text', description: 'Date · place (accent).' },
    price: { control: 'text' },
    oldPrice: { control: 'text', description: 'Struck-through price (Standard); empty hides it.' },
    badge: { control: 'select', options: ['', ...Object.keys(BADGE_VARIANTS)], description: 'Figma Show badge: the Badge pill; empty hides it.' },
    image: { control: 'text' },
    moreText: { control: 'text', description: 'The Zobacz button / link (decorative inside the card link).' },
    href: { control: 'text', description: 'Given: the whole card is one link.' },
    headingTag: { control: 'inline-radio', options: CARD_HEADING_TAGS },
    ...STATE_ARG_TYPES,
  },
  args: {
    variant: 'standard',
    title: 'Negocjacje handlowe dla zespołów B2B',
    text: 'Dwa dni warsztatów z praktykiem: przygotowanie, prowadzenie i domykanie trudnych rozmów z kupcami.',
    meta: 'Termin: 12–13 marca 2026 · Szczecin',
    price: '1 490 zł',
    oldPrice: '1 990 zł',
    badge: 'polecane',
    image: './placeholders/landscape.svg',
    moreText: 'Zobacz',
    href: '#',
    headingTag: 'h3',
    state: 'default',
  },
  parameters: {
    stateTargets: CARD,
    docs: {
      description: {
        component:
          '`a.ds-card-product ds-card-product--{standard|compact|rows}` > `div.__media` (`img.__image`) + `div.__body` (Badge pill, `h3.__title`, `p.__text`, `p.__meta`, `div.__foot` with `p.__price` and a Button pill span / Link span). Hover / focus: photo zoom 5 %, button gradient.',
      },
    },
    // The meta line and the Polecane badge are accent (the DCC palette gap; see Atoms/Button).
    a11y: { test: 'todo' },
  },
};

export const Playground = {};

// Figma Card/Product: Variant Standard, Compact, Rows; Standard hovered.
export const Overview = {
  render: (args) =>
    overviewGrid(
      [
        overviewCell('standard', card('standard', renderCardProduct({ ...args, variant: 'standard' }))),
        overviewCell('standard, hover', card('standard', forceState(renderCardProduct({ ...args, variant: 'standard' }), 'hover', CARD))),
        overviewCell('compact', card('compact', renderCardProduct({ ...args, variant: 'compact' }))),
        overviewCell('rows', card('rows', renderCardProduct({ ...args, variant: 'rows' })), true),
      ],
      '560px',
    ),
};
