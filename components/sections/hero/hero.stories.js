import { CONTRAST_OFF } from '../../../.storybook/a11y.js';
import { OVERVIEW_STATE, STATE_ARG_TYPES, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { DEFAULT_TRAIL } from '../../atoms/breadcrumbs/breadcrumbs.template.js';
import { DEFAULT_HERO_TILES, HERO_HEADING_TAGS, HERO_VARIANTS, renderHero } from './hero.template.js';

// Story only: the placeholder photo on Large and Contact, the illustration on Subpage light, the trail on subpages.
const hero = ({ image, illustration, breadcrumbs, ...args }) =>
  renderHero({
    ...args,
    image: image ?? './placeholders/landscape.svg',
    illustration: illustration ?? (args.variant === 'subpage-light' ? './placeholders/square.svg' : ''),
    breadcrumbs: breadcrumbs ?? DEFAULT_TRAIL,
  });

export default {
  title: 'Sections/Hero',
  render: (args) => hero(args),
  argTypes: {
    variant: { control: 'inline-radio', options: HERO_VARIANTS, description: 'Figma Variant: Large, Contact, Subpage light / violet / orange.' },
    title: { control: 'text', description: 'Empty: the variant’s own copy.' },
    titleAccent: { control: 'text', description: 'The part of the title in the accent colour (Large: „poukładać relacje i kompetencje”).' },
    lead: { control: 'text', description: 'Empty: the variant’s own copy.' },
    leadAccent: { control: 'text', description: 'The part of the lead in the accent colour (Contact: its second sentence).' },
    subtitle: { control: 'text', description: 'Large and Subpage. Empty: none.' },
    button: { control: 'object', description: 'Large and Contact: { text, href } of the Light button; null: none.' },
    tiles: { control: 'object', description: 'Large and Contact: Card/Hero tile args, [] for none.' },
    image: { control: 'text', description: 'Large and Contact photo. Story default: a placeholder.' },
    imageAlt: { control: 'text' },
    illustration: { control: 'text', description: 'Subpage illustration on the right (desktop). Story default on Subpage light: a placeholder.' },
    breadcrumbs: { control: 'object', description: 'Subpage: [{ text, href }], the last item is the current page. Above the box on phones, below it on desktop.' },
    headingTag: { control: 'inline-radio', options: HERO_HEADING_TAGS },
    ...STATE_ARG_TYPES,
  },
  args: {
    variant: 'large',
    title: '',
    lead: '',
    tiles: DEFAULT_HERO_TILES,
    imageAlt: '',
    headingTag: 'h1',
    state: 'default',
  },
  parameters: {
    stateTargets: ['.ds-hero .ds-button', '.ds-hero .ds-card-hero-tile'],
    // DCC palette gaps: the accent title words and the accent subpage title / subtitle on the blue box fail colour
    // contrast (as on the Call to action). Colour-contrast is off (the DCC palette contrast is the owner's decision, .storybook/a11y.js); every other a11y rule fails CI.
    a11y: CONTRAST_OFF,
    docs: {
      description: {
        component:
          '`section.ds-hero.ds-hero--{variant}` (+ `ds-hero--subpage`, `has-photo`) > `div.ds-hero__box` (`img.ds-hero__photo`, `div.ds-hero__inner` > `div.ds-hero__content` (`.ds-hero__title` with Text spans, `p.ds-hero__lead`, `.ds-hero__subtitle`, `div.ds-hero__buttons`) + `div.ds-hero__illustration`) + `ul.ds-hero__tiles` > `li.ds-hero__tile` > Card/Hero tile + `div.ds-hero__crumbs` > Breadcrumbs. State applies to the button and the tiles.',
      },
    },
  },
};

export const Playground = {};

// Figma Section/Hero, Viewport=Desktop: the five variants.
export const Overview = {
  ...OVERVIEW_STATE,
  render: () =>
    overviewGrid(
      // One trail on the page: several navs with the same name would repeat a landmark.
      HERO_VARIANTS.map((variant) => overviewCell(variant, hero({ variant, breadcrumbs: variant === 'subpage-light' ? undefined : [] }), true)),
      '1240px',
    ),
};

// Figma Viewport=Mobile: Large and Subpage on a 390 px phone.
export const Mobile = {
  ...OVERVIEW_STATE,
  globals: { viewport: { value: 'mobile', isRotated: false } },
  render: () => `<div style="display: grid; gap: var(--space-48)">${hero({ variant: 'large' })}${hero({ variant: 'subpage-light' })}</div>`,
};
