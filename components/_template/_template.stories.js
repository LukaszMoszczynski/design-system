// Not loaded by Storybook (.storybook/main.js skips components/_template). Copy it with the rest of the folder.
// Story contract (components/README.md): import the template, never export `render` from a stories file (CSF would take
// it for a story). Two stories: Playground (every arg a control, plus the `state` control) and Overview (every variant,
// the states side by side). At most one or two extra examples, and no Pressed state.
import { OVERVIEW_STATE, STATE_ARG_TYPES, forceState, overviewCell, overviewGrid } from '../../.storybook/state.js';
import { renderExample } from './_template.template.js';
// Importing the script registers window.DS.example. The global decorator `withComponentScripts` (.storybook/decorators.js)
// then calls window.DS.example.init(wrapper) after every render, so the handler works in the canvas.
import './_template.js';

const EXAMPLE = ['.ds-example'];

export default {
  title: 'Atoms/Example',
  render: (args) => renderExample(args),
  argTypes: {
    text: { control: 'text' },
    pressed: { control: 'boolean', description: 'aria-pressed: the toggle is on (its value, not a forced state).' },
    ...STATE_ARG_TYPES,
  },
  args: { text: 'Przełącznik', pressed: false, state: 'default' },
  // The elements the `state` control forces (withForcedState, .storybook/state.js).
  parameters: { stateTargets: EXAMPLE },
};

export const Playground = {};

// Off and on, each at rest and hovered.
export const Overview = {
  ...OVERVIEW_STATE,
  render: (args) =>
    overviewGrid(
      [false, true].flatMap((pressed) => [
        overviewCell(pressed ? 'on' : 'off', renderExample({ ...args, pressed })),
        overviewCell(`${pressed ? 'on' : 'off'}, hover`, forceState(renderExample({ ...args, pressed }), 'hover', EXAMPLE)),
      ]),
    ),
};
