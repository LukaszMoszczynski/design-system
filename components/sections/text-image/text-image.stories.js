import { CONTRAST_OFF } from '../../../.storybook/a11y.js';
import { OVERVIEW_STATE, STATE_ARG_TYPES, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { TEXT_IMAGE_HEADING_TAGS, TEXT_IMAGE_VARIANTS, renderTextImage } from './text-image.template.js';
// Importing the script registers window.DS.reveal: below the fold the text and photos lift in with GSAP.
import '../../base/reveal.js';

// Story only: the variant's placeholder photos and background unless given.
const IMAGES = { panorama: './placeholders/wide.svg', photos: './placeholders/landscape.svg' };
const textImage = ({ image, image2, background, ...args }) =>
  renderTextImage({
    ...args,
    image: image ?? IMAGES[args.variant] ?? './placeholders/landscape.svg',
    image2: image2 ?? (args.variant === 'photos' ? './placeholders/portrait.svg' : ''),
    background: background ?? (args.variant === 'centered' ? './placeholders/wide.svg' : ''),
  });

export default {
  title: 'Sections/Text + Image',
  render: (args) => textImage(args),
  argTypes: {
    variant: { control: 'inline-radio', options: TEXT_IMAGE_VARIANTS, description: 'Figma Variant: Image right, Image left, Panorama, Centered, Photos.' },
    overline: { control: 'text', description: 'The Heading group overline (empty: none). Default: the variant’s own copy.' },
    title: { control: 'text', description: 'Empty: the variant’s own copy.' },
    text: { control: 'text', description: 'The prose (Photos: the card text). Empty: none. Default: the variant’s own copy.' },
    steps: { control: 'object', description: 'The numbered steps (Image left by default): an array of strings.' },
    actions: { control: 'object', description: '[{ text, href }]: Primary + Light buttons (Centered: Accent); Panorama: uppercase text links.' },
    image: { control: 'text', description: 'The photo (Photos: the wide one). Story default: a placeholder.' },
    imageAlt: { control: 'text' },
    image2: { control: 'text', description: 'Photos: the narrow photo on the right.' },
    image2Alt: { control: 'text' },
    background: { control: 'text', description: 'Centered: the faint background illustration (decorative).' },
    badgeText: { control: 'text', description: 'Photos: the Badge/Circular wording (empty: no badge).' },
    headingTag: { control: 'inline-radio', options: TEXT_IMAGE_HEADING_TAGS },
    ...STATE_ARG_TYPES,
  },
  args: {
    variant: 'image-right',
    imageAlt: '',
    badgeText: 'Wyzwanie? Znajdziemy rozwiązanie',
    headingTag: 'h2',
    state: 'default',
  },
  parameters: {
    stateTargets: ['.ds-text-image .ds-button', '.ds-text-image .ds-link'],
    // DCC palette gaps: the accent overline and the white label on the Accent button fail colour contrast.
    // Colour-contrast is off (the DCC palette contrast is the owner's decision, .storybook/a11y.js); every other a11y rule fails CI.
    a11y: CONTRAST_OFF,
    docs: {
      description: {
        component:
          '`section.ds-text-image.ds-text-image--{variant}` > `div.ds-text-image__container` > (`.ds-text-image__grid` > `div.ds-text-image__text[data-ds-reveal]` (Heading group, `.ds-text-image__prose`, `ol.ds-text-image__steps`, `div.ds-text-image__buttons`) + `figure.ds-text-image__media[data-ds-reveal]`) | Panorama `div.ds-text-image__split` (Heading group + `.ds-text-image__aside` with `div.ds-text-image__links`) + `figure.ds-text-image__media--wide` | Photos `div.ds-text-image__head` + `div.ds-text-image__trio` (photo, `div.ds-text-image__card` with Badge/Circular `.ds-text-image__badge`, photo). State applies to the buttons / links.',
      },
    },
  },
};

export const Playground = {};

// Figma Section/Text + image, Viewport=Desktop: the five variants.
export const Overview = {
  ...OVERVIEW_STATE,
  render: () =>
    overviewGrid(
      TEXT_IMAGE_VARIANTS.map((variant) => overviewCell(variant, textImage({ variant }), true)),
      '1240px',
    ),
};

// Figma Viewport=Mobile: Image right and Panorama on a 390 px phone.
export const Mobile = {
  ...OVERVIEW_STATE,
  globals: { viewport: { value: 'mobile', isRotated: false } },
  render: () => `${textImage({ variant: 'image-right' })}${textImage({ variant: 'panorama' })}`,
};
