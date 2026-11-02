import { renderBreadcrumbs } from './breadcrumbs.template.js';

const HOME = { label: 'Strona główna', href: '/' };
const TRAINING = { label: 'Szkolenia', href: '/szkolenia/' };
const PROGRAMS = { label: 'Programy rozwojowe', href: '/szkolenia/programy/' };
const CURRENT = { label: 'Negocjacje handlowe' };
const MOBILE = { viewport: { value: 'mobile', isRotated: false } };
// Item states (Figma Breadcrumb/Item) are forced on the first link only.
const FIRST_LINK = '.ds-breadcrumbs__item:first-child .ds-breadcrumbs__link';

export default {
  title: 'Atoms/Breadcrumbs',
  render: (args) => `<div style="padding: var(--space-gutter)">${renderBreadcrumbs(args)}</div>`,
  argTypes: {
    items: { control: 'object', description: '`[{ label, href }]`; the last item is the current page (no href).' },
    label: { control: 'text', description: 'aria-label of the `<nav>`.' },
  },
  args: { items: [HOME, CURRENT], label: 'Ścieżka nawigacji' },
  parameters: {
    docs: {
      description: {
        component:
          '`nav.ds-breadcrumbs > ol.ds-breadcrumbs__list > li.ds-breadcrumbs__item`, links `.ds-breadcrumbs__link`, the last item `span.ds-breadcrumbs__current[aria-current="page"]`. The › is CSS.',
      },
    },
  },
};

export const Levels2 = {};
export const Levels3 = { args: { items: [HOME, TRAINING, CURRENT] } };
export const Levels4 = { args: { items: [HOME, TRAINING, PROGRAMS, CURRENT] } };
export const Levels2Mobile = { globals: MOBILE };
export const Levels3Mobile = { args: { items: [HOME, TRAINING, CURRENT] }, globals: MOBILE };
export const Levels4Mobile = { args: { items: [HOME, TRAINING, PROGRAMS, CURRENT] }, globals: MOBILE };
export const ItemHover = { args: { items: [HOME, TRAINING, CURRENT] }, parameters: { pseudo: { hover: [FIRST_LINK] } } };
export const ItemFocus = { args: { items: [HOME, TRAINING, CURRENT] }, parameters: { pseudo: { focusVisible: [FIRST_LINK] } } };
