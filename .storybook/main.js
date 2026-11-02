/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  stories: ['../stories/**/*.mdx', '../components/**/*.stories.js'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', 'storybook-addon-pseudo-states'],
  framework: '@storybook/html-vite',
  // Placeholder images are served as ./placeholders/<name>.svg (relative, so they work under /design-system/ on Pages).
  staticDirs: ['../public'],
  core: { disableTelemetry: true },
};

export default config;
