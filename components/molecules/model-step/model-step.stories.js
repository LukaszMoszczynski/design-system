import { STATE_ARG_TYPES, forceState, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { DEFAULT_MODEL_STEPS, renderModelStep, renderModelSteps } from './model-step.template.js';

const frame = (markup) => `<div style="max-width: 676px; padding: var(--space-24) var(--space-gutter)">${markup}</div>`;
const single = (args) => `<ol class="ds-model-steps" role="list">${renderModelStep(args)}</ol>`;

export default {
  title: 'Molecules/Model Step',
  render: (args) => frame(single(args)),
  argTypes: {
    letter: { control: 'text' },
    label: { control: 'text', description: 'Bold label at the start of the text.' },
    text: { control: 'text' },
    active: { control: 'boolean', description: 'is-active: the double-hover look, set by the model section.' },
    ...STATE_ARG_TYPES,
  },
  args: { ...DEFAULT_MODEL_STEPS[0], active: false, state: 'default' },
  parameters: {
    stateTargets: ['.ds-model-step'],
    docs: {
      description: {
        component:
          '`li.ds-model-step(.is-active?) > span.ds-model-step__letter (Letter circle, step) + p.ds-model-step__text (<strong> label + text)`, in `ol.ds-model-steps`. Hover: accent letter scaled 1.18, text 1.03.',
      },
    },
  },
};

export const Playground = {};

// Figma Model step: Default, Hover; then a list of steps.
export const Overview = {
  render: () =>
    overviewGrid(
      [
        overviewCell('Default', single({})),
        overviewCell('Hover', forceState(single({}), 'hover', ['.ds-model-step'])),
        overviewCell('Steps', renderModelSteps()),
      ],
      '560px',
    ),
};
