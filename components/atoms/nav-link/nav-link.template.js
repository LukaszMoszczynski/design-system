// Header navigation atoms. Figma: Atoms → Navigation · Tags · Numbers → Nav link (21:170), Nav CTA (21:179),
// Icon/Burger (21:187). DCC: .dcc-header__link, .dcc-header__cta, .dcc-header__burger (blocks/naglowek).
import { escapeHtml } from '../../_shared/escape.js';

// Nav link: current = aria-current="page".
export function renderNavLink({ text = 'Oferta', href = '#', current = false } = {}) {
  return `<a class="ds-nav-link" href="${escapeHtml(href)}"${current ? ' aria-current="page"' : ''}>${escapeHtml(text)}</a>`;
}

// The header call-to-action pill (phone number link on the site).
export function renderNavCta({ text = 'Dzwonię', href = 'tel:+48000000000' } = {}) {
  return `<a class="ds-nav-cta" href="${escapeHtml(href)}">${escapeHtml(text)}</a>`;
}

// The phone menu toggle. The header organism flips aria-expanded; open draws the ×.
export function renderNavBurger({ open = false, ariaLabel = 'Menu', controls = '' } = {}) {
  const controlsAttribute = controls ? ` aria-controls="${escapeHtml(controls)}"` : '';
  return `<button type="button" class="ds-nav-burger" aria-expanded="${open ? 'true' : 'false'}" aria-label="${escapeHtml(ariaLabel)}"${controlsAttribute}><span class="ds-nav-burger__lines"></span></button>`;
}
