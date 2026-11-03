import { CONTRAST_OFF } from '../../../.storybook/a11y.js';
import { overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { CARD_HEADING_TAGS } from '../../_shared/heading-tags.js';
import { CARD_PARTNER_VARIANTS, renderCardPartner } from './card-partner.template.js';

const card = (markup) => `<div style="width: var(--size-card-width); max-width: 100%">${markup}</div>`;
const frame = (markup) => `<div style="padding: var(--space-24) var(--space-gutter)">${card(markup)}</div>`;

export default {
  title: 'Molecules/Card Partner',
  render: (args) => frame(renderCardPartner(args)),
  argTypes: {
    variant: { control: 'inline-radio', options: CARD_PARTNER_VARIANTS, description: 'Figma Layout: Grid (1 px border, left, 2XL), Carousel (2 px border, centred, XL).' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    text: { control: 'text' },
    logo: { control: 'text', description: 'Logo URL, shown 64 px tall.' },
    logoAlt: { control: 'text' },
    headingTag: { control: 'inline-radio', options: CARD_HEADING_TAGS },
  },
  args: {
    variant: 'grid',
    title: 'Północna Izba Gospodarcza (PIG)',
    subtitle: 'Aktywni przedsiębiorcy w regionie',
    text: 'Jesteśmy członkami największej izby gospodarczej w Polsce, której siedziba znajduje się w Szczecinie. Uczestniczymy w życiu lokalnego biznesu.',
    logo: './placeholders/wide.svg',
    logoAlt: 'Logo Północnej Izby Gospodarczej',
    headingTag: 'h3',
  },
  parameters: {
    docs: {
      description: {
        component:
          '`article.ds-card-partner ds-card-partner--{grid|carousel}` > `img.ds-card-partner__logo` + `p.ds-card-partner__subtitle` + `h3.ds-card-partner__title` + `p.ds-card-partner__text`. Not a link, no states.',
      },
    },
    // The subtitle is accent text on the card (the DCC palette gap; see Atoms/Button).
    a11y: CONTRAST_OFF,
  },
};

export const Playground = {};

// Figma Card/Partner: Layout Grid, Carousel.
export const Overview = {
  render: (args) => overviewGrid(CARD_PARTNER_VARIANTS.map((variant) => overviewCell(variant, card(renderCardPartner({ ...args, variant })))), '384px'),
};
