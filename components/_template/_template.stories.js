// Not loaded by Storybook (.storybook/main.js skips components/_template). Copy it with the rest of the folder.
// Story contract: import the template, never export `render` from a stories file (CSF would take it for a story).
// Declare argTypes for every Figma property and one story per variant/state (forced states via story globals.pseudo, see README).
import { renderExample } from './_template.template.js';
// Importing the script registers window.DS.example. The global decorator `withComponentScripts` (.storybook/decorators.js)
// then calls window.DS.example.init(wrapper) after every render, so the handler works in the canvas.
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
export const Hover = { globals: { pseudo: { hover: ['.ds-example'] } } };
