// Not loaded by Storybook (.storybook/main.js skips components/_template). Copy it with the rest of the folder.
// Story contract: import the template, never export `render` from a stories file (CSF would take it for a story).
// Declare argTypes for every Figma property and one story per variant/state (states via parameters.pseudo).
import { renderExample } from './_template.template.js';
import './_template.js';

export default {
  title: 'Atoms/Example',
  render: (args) => renderExample(args),
  argTypes: {
    label: { control: 'text' },
    pressed: { control: 'boolean' },
  },
  args: { label: 'Przełącznik', pressed: false },
};

export const Default = {};
export const Pressed = { args: { pressed: true } };
export const Hover = { parameters: { pseudo: { hover: true } } };
