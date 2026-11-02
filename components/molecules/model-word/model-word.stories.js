import { OVERVIEW_STATE, STATE_ARG_TYPES, forceState, overviewCell, overviewGrid } from '../../../.storybook/state.js';
import { renderModelWord } from './model-word.template.js';

const frame = (markup) => `<div style="padding: var(--space-24) var(--space-gutter)">${markup}</div>`;
const THIRD_LETTER = ['.ds-letter-circle:nth-child(3)'];

export default {
  title: 'Molecules/Model Word',
  render: (args) => frame(renderModelWord(args)),
  argTypes: {
    word: { control: 'text' },
    active: { control: { type: 'number', min: -1 }, description: 'Index of the lit letter (−1: none).' },
    ...STATE_ARG_TYPES,
  },
  args: { word: 'EVOLUTION', active: -1, state: 'default' },
  parameters: {
    stateTargets: THIRD_LETTER,
    docs: {
      description: {
        component:
          '`p.ds-model-word[aria-hidden]` of word-variant Letter circles (54 px, 2 px page-colour border, −2 px overlap). Hover or `is-active` lights a letter (accent, scaled 1.18). State applies to the third letter.',
      },
    },
  },
};

export const Playground = {};

// At rest, Figma's first letter Active, and a hovered letter.
export const Overview = {
  ...OVERVIEW_STATE,
  render: () =>
    overviewGrid(
      [
        overviewCell('Default', renderModelWord({})),
        overviewCell('First letter active', renderModelWord({ active: 0 })),
        overviewCell('Letter hover', forceState(renderModelWord({}), 'hover', THIRD_LETTER)),
      ],
      '520px',
    ),
};
