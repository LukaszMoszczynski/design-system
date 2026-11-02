import { renderNavBurger, renderNavCta, renderNavLink } from './nav-link.template.js';

const frame = (markup) => `<div style="padding: var(--space-24)">${markup}</div>`;
const MOBILE = { viewport: { value: 'mobile', isRotated: false } };

export default {
  title: 'Atoms/Nav Link',
  render: (args) => frame(renderNavLink(args)),
  argTypes: {
    label: { control: 'text' },
    href: { control: 'text' },
    current: { control: 'boolean', description: 'Figma State=Current (aria-current="page").' },
  },
  args: { label: 'Oferta', href: '#', current: false },
  parameters: {
    docs: {
      description: {
        component:
          'Header navigation atoms: `.ds-nav-link` (Default, Hover, Focus, Current), `.ds-nav-cta` (Desktop/Mobile, Hover) and `.ds-nav-burger` (Closed/Open via aria-expanded).',
      },
    },
  },
};

export const Default = {};
export const Hover = { parameters: { pseudo: { hover: ['.ds-nav-link'] } } };
export const Focus = { parameters: { pseudo: { focusVisible: ['.ds-nav-link'] } } };
export const Current = { args: { current: true } };

export const Cta = { render: () => frame(renderNavCta()) };
export const CtaHover = { ...Cta, parameters: { pseudo: { hover: ['.ds-nav-cta'] } } };
export const CtaMobile = { ...Cta, globals: MOBILE };
export const CtaMobileHover = { ...Cta, globals: MOBILE, parameters: { pseudo: { hover: ['.ds-nav-cta'] } } };

export const BurgerClosed = { render: () => frame(renderNavBurger()) };
export const BurgerOpen = { render: () => frame(renderNavBurger({ open: true })) };
