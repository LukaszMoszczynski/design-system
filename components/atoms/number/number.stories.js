import { LETTER_VARIANTS, renderLetterCircle, renderPageNumber } from './number.template.js';

const frame = (markup) => `<div style="display: flex; gap: var(--space-16); align-items: center; padding: var(--space-24)">${markup}</div>`;
const MOBILE = { viewport: { value: 'mobile', isRotated: false } };

export default {
  title: 'Atoms/Number',
  render: (args) => frame(renderLetterCircle(args)),
  argTypes: {
    text: { control: 'text', description: 'The letter or digit.' },
    variant: { control: 'inline-radio', options: LETTER_VARIANTS, description: 'Figma Context: Step, Word, Industry.' },
    active: { control: 'boolean', description: 'Figma State=Active (`is-active`).' },
  },
  args: { text: 'E', variant: 'step', active: false },
  parameters: {
    docs: {
      description: {
        component:
          'Letter circle `.ds-letter-circle ds-letter-circle--{step|word|industry}` (+ `is-active`) and page number `.ds-page-number` (current = `aria-current="page"`).',
      },
    },
  },
};

export const LetterStep = {};
export const LetterStepActive = { args: { active: true } };
export const LetterWord = { args: { variant: 'word' } };
export const LetterWordActive = { args: { variant: 'word', active: true } };
export const LetterIndustry = { args: { variant: 'industry', text: '1' } };
export const LetterIndustryActive = { args: { variant: 'industry', text: '1', active: true } };

const pages = () => [1, 2, 3].map((number) => renderPageNumber({ text: String(number), current: number === 2 })).join('');
export const PageNumbers = { render: () => frame(pages()) };
export const PageNumberHover = {
  render: () => frame(renderPageNumber({ text: '1' })),
  globals: { pseudo: { hover: ['.ds-page-number'] } },
};
export const PageNumbersMobile = { render: () => frame(pages()), globals: MOBILE };
