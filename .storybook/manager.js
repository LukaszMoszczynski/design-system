import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({ base: 'light', brandTitle: 'Design system', brandUrl: 'https://github.com/LukaszMoszczynski/design-system' }),
});
