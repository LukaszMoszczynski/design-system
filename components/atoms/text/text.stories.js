import { TEXT_TAGS, TEXT_TONES, TEXT_VARIANTS, renderText } from './text.template.js';

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
    text: { control: 'text', description: 'Visible text.' },
    variant: { control: 'select', options: TEXT_VARIANTS, description: 'Figma Style. Desktop/Mobile come from the fluid tokens: resize the viewport.' },
    tone: { control: 'select', options: TEXT_TONES, description: 'Colour: inherit (default, from the surface) or a text token.' },
    tag: { control: 'select', options: TEXT_TAGS, description: 'HTML element; independent of the look.' },
  },
  args: { text: 'Rozwijamy liderów i zespoły', variant: 'body', tone: 'inherit', tag: 'p' },
  parameters: {
    docs: {
      description: {
        component:
          '`.ds-text ds-text--{variant}` (+ `ds-text--{default|muted|primary|accent|on-brand}` tone; colour is inherited without one). Size scale desktop → mobile: 4XL 56→32, 3XL 44→28, 2XL 32→24, XL 28→20, LG 20→16, Body 16, Small 12, Overline 20→12, Number 64, Button 20→16, Question 20→16. Figma Viewport=Mobile is the same story in the Mobile 390 viewport.',
      },
    },
  },
};

export const Xl4 = { name: '4XL', args: { variant: '4xl', tag: 'h1' } };
export const Xl3 = { name: '3XL', args: { variant: '3xl', tag: 'h2' } };
export const Xl2 = { name: '2XL', args: { variant: '2xl', tag: 'h3' } };
export const Xl = { name: 'XL', args: { variant: 'xl', tag: 'h4' } };
export const Lg = { name: 'LG', args: { variant: 'lg', tag: 'h5' } };
export const Body = { args: { variant: 'body' } };
export const BodyBold = { args: { variant: 'body-bold' } };
export const Small = { args: { variant: 'small' } };
export const Overline = { args: { variant: 'overline', text: SAMPLES.overline } };
export const NumberStyle = { name: 'Number', args: { variant: 'number', text: SAMPLES.number } };
export const Button = { args: { variant: 'button', text: SAMPLES.button, tag: 'span' } };
export const Question = { args: { variant: 'question', text: SAMPLES.question } };

// The whole ladder, as the Figma section shows it.
export const Scale = {
  render: (args) =>
    `<div style="display: grid; gap: var(--space-16); padding: var(--space-24)">${TEXT_VARIANTS.map((variant) =>
      renderText({ ...args, variant, text: SAMPLES[variant] ?? `${variant.toUpperCase()} · ${args.text}` }),
    ).join('')}</div>`,
};

// Tones: inherited on a blue surface, and the text tokens on the page.
export const OnBrand = {
  args: { variant: '2xl', tag: 'h2' },
  render: (args) => `<div style="padding: var(--space-24); background: var(--color-surface-brand); color: var(--color-text-on-brand)">${renderText(args)}</div>`,
};
// Accent text on the page is 3.23:1 (the brand contrast gap, see Atoms/Button): reported as a11y todo.
export const Tones = {
  parameters: { a11y: { test: 'todo' } },
  render: (args) =>
    `<div style="display: grid; gap: var(--space-8); padding: var(--space-24)">${TEXT_TONES.map((tone) => renderText({ ...args, tone, text: `${tone} · ${args.text}` })).join('')}</div>`,
};
