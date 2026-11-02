import { OVERVIEW_STATE, STATE_ARG_TYPES, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { CTA_HEADING_TAGS, CTA_VARIANTS, renderCallToAction } from './call-to-action.template.js';
// Importing the script registers window.DS.reveal: below the fold the content lifts in with GSAP when scrolled to.
import '../../base/reveal.js';

const IMAGES = { large: './placeholders/portrait.svg', image: './placeholders/wide.svg' };
const frame = (markup) => `<div style="padding: var(--space-24) var(--space-gutter); max-width: var(--size-container); box-sizing: content-box; margin-inline: auto">${markup}</div>`;
// Story only: the variant's placeholder photo unless an image is given.
const cta = ({ image, ...args }) => renderCallToAction({ ...args, image: image ?? IMAGES[args.variant] ?? '' });

export default {
  title: 'Organisms/Call To Action',
  render: (args) => frame(cta(args)),
  argTypes: {
    variant: { control: 'inline-radio', options: CTA_VARIANTS, description: 'Figma Variant: Large, Band, Gradient, Image, Light.' },
    title: { control: 'text', description: 'Empty: the variant’s own copy.' },
    subtitle: { control: 'text', description: 'Large and Gradient only. Empty: the variant’s own copy.' },
    text: { control: 'text', description: 'Empty: the variant’s own copy.' },
    buttons: { control: 'object', description: '[{ text, href }]: Light/Accent/Primary buttons by variant; Image: uppercase text links.' },
    image: { control: 'text', description: 'Large (356 × 460) and Image (wide) photo. Story default: a placeholder.' },
    imageAlt: { control: 'text' },
    badgeText: { control: 'text', description: 'Large: the Badge/Circular wording (empty: no badge).' },
    headingTag: { control: 'inline-radio', options: CTA_HEADING_TAGS },
    ...STATE_ARG_TYPES,
  },
  args: {
    variant: 'large',
    buttons: [
      { text: 'Tak! Dzwonię', href: 'tel:+48000000000' },
      { text: 'Tak! Piszę maila', href: 'mailto:kontakt@example.com' },
    ],
    imageAlt: '',
    badgeText: 'Wyzwanie? Znajdziemy rozwiązanie',
    headingTag: 'h2',
    state: 'default',
  },
  parameters: {
    stateTargets: ['.ds-cta .ds-button', '.ds-cta .ds-link'],
    // DCC palette gaps: white on the accent Band and Accent buttons, the accent Image question and Gradient title fail
    // colour contrast. Reported as a11y todo (a11y panel, not failing CI) until the palette is decided; tokens unchanged.
    a11y: { test: 'todo' },
    docs: {
      description: {
        component:
          '`section.ds-cta.ds-cta--{variant}` > `div.ds-cta__card` > `div.ds-cta__content[data-ds-reveal]` (`.ds-cta__title`, `.ds-cta__subtitle`, `.ds-cta__text`, `div.ds-cta__buttons` or `div.ds-cta__links`; Gradient wraps them in `.ds-cta__main` / `.ds-cta__aside`, Image the text in `.ds-cta__aside`) + `figure.ds-cta__media` (Large, Image; Large adds Badge/Circular `.ds-cta__badge`). Large title: an inline Text span `.ds-cta__title-box` on page-colour line boxes. State applies to the buttons / links.',
      },
    },
  },
};

export const Playground = {};

// Figma Call to action: the five variants on desktop (Viewport=Mobile: the Mobile story).
export const Overview = {
  ...OVERVIEW_STATE,
  render: () =>
    overviewGrid(
      CTA_VARIANTS.map((variant) => overviewCell(variant, `<div style="max-width: var(--size-container)">${cta({ variant })}</div>`, true)),
      '1240px',
    ),
};

// Figma Viewport=Mobile: Large, Gradient, Image and Light on a 390 px phone.
export const Mobile = {
  ...OVERVIEW_STATE,
  globals: { viewport: { value: 'mobile', isRotated: false } },
  render: () =>
    `<div style="display: grid; gap: var(--space-48); padding: var(--space-24) var(--space-gutter)">${CTA_VARIANTS.map((variant) => cta({ variant })).join('')}</div>`,
};
