import { TEXT_STYLES, TEXT_TAGS, renderText } from './text.template.js';

const SAMPLES = {
  number: '1500',
  button: 'Poznaj ofertę',
  question: 'Jak wygląda pierwsze spotkanie?',
  overline: 'Szkolenia dla firm',
};

export default {
  title: 'Atoms/Text',
  render: (args) => `<div style="padding: var(--space-24)">${renderText(args)}</div>`,
  argTypes: {
    text: { control: 'text' },
    style: { control: 'select', options: TEXT_STYLES, description: 'Figma Style. Desktop/Mobile come from the fluid tokens: resize the viewport.' },
    tag: { control: 'select', options: TEXT_TAGS, description: 'HTML element; independent of the look.' },
  },
  args: { text: 'Rozwijamy liderów i zespoły', style: 'body', tag: 'p' },
  parameters: {
    docs: {
      description: {
        component:
          '`.ds-text ds-text--{style}`. Size scale desktop → mobile: 4XL 56→32, 3XL 44→28, 2XL 32→24, XL 28→20, LG 20→16, Body 16, Small 12, Overline 20→12, Number 64, Button 20→16, Question 20→16. Figma Viewport=Mobile is the same story in the Mobile 390 viewport.',
      },
    },
  },
};

export const Xl4 = { name: '4XL', args: { style: '4xl', tag: 'h1' } };
export const Xl3 = { name: '3XL', args: { style: '3xl', tag: 'h2' } };
export const Xl2 = { name: '2XL', args: { style: '2xl', tag: 'h3' } };
export const Xl = { name: 'XL', args: { style: 'xl', tag: 'h4' } };
export const Lg = { name: 'LG', args: { style: 'lg', tag: 'h5' } };
export const Body = { args: { style: 'body' } };
export const BodyBold = { args: { style: 'body-bold' } };
export const Small = { args: { style: 'small' } };
export const Overline = { args: { style: 'overline', text: SAMPLES.overline } };
export const NumberStyle = { name: 'Number', args: { style: 'number', text: SAMPLES.number } };
export const Button = { args: { style: 'button', text: SAMPLES.button, tag: 'span' } };
export const Question = { args: { style: 'question', text: SAMPLES.question } };

// The whole ladder, as the Figma section shows it.
export const Scale = {
  render: (args) =>
    `<div style="display: grid; gap: var(--space-16); padding: var(--space-24)">${TEXT_STYLES.map((style) =>
      renderText({ ...args, style, text: SAMPLES[style] ?? `${style.toUpperCase()} · ${args.text}` }),
    ).join('')}</div>`,
};
