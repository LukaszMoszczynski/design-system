import '../dist/tokens/shared.css';
import '../dist/tokens/dcc.css';
import '../dist/tokens/omelanski.css';
import '../brands/dcc/fonts.css';
import '../brands/omelanski/fonts.css';
import 'swiper/swiper-bundle.css';
import Swiper from 'swiper/bundle';
import { DEFAULT_GLOBALS, followToolbarOnDocsPages, withBrandTheme } from './decorators.js';

// Every component stylesheet, base.css included. Components load Swiper the way a site does: from window.
import.meta.glob('../components/**/*.css', { eager: true });
window.Swiper = Swiper;

followToolbarOnDocsPages();

/** @type { import('@storybook/html-vite').Preview } */
const preview = {
  globalTypes: {
    brand: {
      description: 'Brand',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: [
          { value: 'dcc', title: 'DCC' },
          { value: 'omelanski', title: 'Omelanski' },
        ],
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
  decorators: [withBrandTheme],
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
