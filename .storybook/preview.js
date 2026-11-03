import '../dist/tokens/shared.css';
import 'swiper/swiper-bundle.css';
import Swiper from 'swiper/bundle';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BRAND_ITEMS } from './brands.js';
import { DEFAULT_GLOBALS, followToolbarOnDocsPages, withBrandTheme, withComponentScripts } from './decorators.js';
import { withForcedState } from './state.js';

// Every component stylesheet, base.css included. Components load Swiper and GSAP the way a site does: from window.
import.meta.glob('../components/**/*.css', { eager: true });
window.Swiper = Swiper;
// GSAP is the animation tool (owner): components read window.gsap / window.ScrollTrigger and degrade without them.
gsap.registerPlugin(ScrollTrigger);
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

followToolbarOnDocsPages();

/** @type { import('@storybook/html-vite').Preview } */
const preview = {
  globalTypes: {
    brand: {
      description: 'Brand',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: BRAND_ITEMS,
        dynamicTitle: true,
      },
    },
    theme: {
      description: 'Theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: DEFAULT_GLOBALS,
  // withComponentScripts returns the story's wrapper element, so withForcedState can mark its targets.
  decorators: [withComponentScripts, withForcedState, withBrandTheme],
  parameters: {
    layout: 'fullscreen',
    controls: { matchers: { color: /(background|color)$/i } },
    viewport: {
      options: {
        desktop: { name: 'Desktop 1440', styles: { width: '1440px', height: '900px' }, type: 'desktop' },
        mobile: { name: 'Mobile 390', styles: { width: '390px', height: '844px' }, type: 'mobile' },
      },
    },
    options: {
      storySort: { order: ['Foundations', 'Atoms', 'Molecules', 'Organisms', 'Sections'] },
    },
    // Violations fail the test runner (CI).
    a11y: { test: 'error' },
  },
};

export default preview;
