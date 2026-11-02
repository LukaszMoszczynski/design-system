import { renderModelWord } from './model-word.template.js';

const frame = (markup) => `<div style="padding: var(--space-24) var(--space-gutter)">${markup}</div>`;

export default {
  title: 'Molecules/Model Word',
  render: (args) => frame(renderModelWord(args)),
  argTypes: {
    word: { control: 'text' },
    active: { control: { type: 'number', min: -1 }, description: 'Index of the lit letter (−1: none).' },
  },
  args: { word: 'EVOLUTION', active: -1 },
  parameters: {
    docs: {
      description: {
        component:
          '`p.ds-model-word[aria-hidden]` of word-variant Letter circles (54 px, 2 px page-colour border, −2 px overlap). Hover or `is-active` lights a letter (accent, scaled 1.18).',
      },
    },
  },
};

export const Default = {};
// Figma Model word: the first letter Active.
export const FirstActive = { name: 'First letter Active', args: { active: 0 } };
export const LetterHover = { name: 'Letter Hover', globals: { pseudo: { hover: ['.ds-model-word .ds-letter-circle:nth-child(3)'] } } };
