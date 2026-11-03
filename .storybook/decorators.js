// Brand and theme switching. Both are plain data attributes on <html>, the same hook a site uses:
// <html data-brand="dcc" data-theme="dark">.
import { addons } from 'storybook/preview-api';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';

import { BRANDS } from './brands.js';

export { BRANDS };
export const THEMES = ['light', 'dark'];
export const DEFAULT_GLOBALS = { brand: 'dcc', theme: 'light' };

export function applyBrandTheme({ brand, theme } = {}) {
  const root = document.documentElement;
  root.dataset.brand = BRANDS.includes(brand) ? brand : DEFAULT_GLOBALS.brand;
  root.dataset.theme = THEMES.includes(theme) ? theme : DEFAULT_GLOBALS.theme;
}

// Stories: set the attributes before every render, so the test runner and "Show code" see the right brand.
export const withBrandTheme = (storyFn, context) => {
  applyBrandTheme(context.globals);
  return storyFn();
};

// Docs pages (MDX without stories) render no decorators, so they follow the toolbar through the
// preview channel instead. The Foundations blocks watch the <html> attributes and re-read the values.
export function followToolbarOnDocsPages() {
  applyBrandTheme(DEFAULT_GLOBALS);
  const channel = addons.getChannel();
  channel.on(SET_GLOBALS, ({ globals }) => applyBrandTheme(globals));
  channel.on(GLOBALS_UPDATED, ({ globals }) => applyBrandTheme(globals));
}

// Component scripts auto-init once at import, before any story DOM exists. This decorator renders the story
// into a wrapper and calls init(wrapper) of every registered window.DS.<name>, so handlers attach on each render.
export const withComponentScripts = (storyFn) => {
  const result = storyFn();
  const wrapper = typeof result === 'string' ? document.createElement('div') : result;
  if (typeof result === 'string') {
    wrapper.style.display = 'contents';
    wrapper.innerHTML = result;
  }
  Object.values(window.DS ?? {}).forEach((component) => component.init?.(wrapper));
  return wrapper;
};
