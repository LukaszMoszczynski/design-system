import { DEFAULT_MODEL_STEPS, renderModelStep, renderModelSteps } from './model-step.template.js';

const frame = (markup) => `<div style="max-width: 676px; padding: var(--space-24) var(--space-gutter)">${markup}</div>`;

export default {
  title: 'Molecules/Model Step',
  render: (args) => frame(`<ol class="ds-model-steps" role="list">${renderModelStep(args)}</ol>`),
  argTypes: {
    letter: { control: 'text' },
    label: { control: 'text', description: 'Bold label at the start of the text.' },
    text: { control: 'text' },
    active: { control: 'boolean', description: 'is-active: the double-hover look, set by the model section.' },
  },
  args: { ...DEFAULT_MODEL_STEPS[0], active: false },
  parameters: {
    docs: {
      description: {
        component:
          '`li.ds-model-step(.is-active?) > span.ds-model-step__letter (Letter circle, step) + p.ds-model-step__text (<strong> label + text)`, in `ol.ds-model-steps`. Hover: accent letter scaled 1.18, text 1.03.',
      },
    },
  },
};

// Figma Model step: Default, Hover.
export const Default = {};
export const Hover = { globals: { pseudo: { hover: ['.ds-model-step'] } } };
export const Steps = { render: () => frame(renderModelSteps()) };
