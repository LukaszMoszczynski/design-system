// Accordion: FAQ rows on native <details>/<summary>, so they open and close without JS.
// Figma: Molecules → Accordion/Item (10:54) and Accordion (10:121, Layout Two columns / One column = variant). DCC: blocks/faq.
// Every item starts closed (Figma's open first row is an example). accordion.js: data-ds-single keeps one item open per
// list; with GSAP it animates the height.
import { escapeHtml } from '../../_shared/escape.js';
import { renderIcon } from '../../atoms/icon/icon.template.js';
import { renderText } from '../../atoms/text/text.template.js';

export const ACCORDION_VARIANTS = ['one-column', 'two-columns'];

export const DEFAULT_FAQ = [
  { question: 'Jak wygląda pierwsze spotkanie z trenerem?', answer: 'Zaczynamy od krótkiej rozmowy o celach i sytuacji zespołu. Na tej podstawie trener dobiera ćwiczenia i przykłady z Waszej branży.' },
  { question: 'Czy szkolenie może odbyć się w naszej siedzibie?', answer: 'Tak. Przyjeżdżamy do Waszego biura w całej Polsce albo prowadzimy warsztat w wynajętej sali.' },
  { question: 'Ile osób może wziąć udział w warsztacie?', answer: 'Najlepiej pracuje się w grupie od 8 do 14 osób, tak by każdy miał czas na ćwiczenia.' },
  { question: 'Czy po szkoleniu otrzymamy materiały?', answer: 'Każdy uczestnik dostaje skrypt z ćwiczeniami i listę narzędzi do dalszej pracy.' },
  { question: 'Jak długo trwa jeden moduł?', answer: 'Moduł to zwykle jeden dzień warsztatów, czyli 7 godzin z przerwami.' },
  { question: 'Czy wystawiacie certyfikaty uczestnictwa?', answer: 'Tak, każdy uczestnik otrzymuje imienny certyfikat po zakończeniu programu.' },
];

// The shared question row of every <details> molecule (Accordion, Accordion/Challenge, Card/Training row): the text and
// the plus/minus Icons. accordion.css (.ds-accordion-summary) resets the marker, draws the focus ring and swaps the icons
// on details[open]:not(.is-closing); `className` adds the placing molecule's own look.
export function renderAccordionSummary({ text = DEFAULT_FAQ[0].question, className = '' } = {}) {
  const classes = ['ds-accordion-summary', className].filter(Boolean).map((name) => escapeHtml(name)).join(' ');
  const icons = `${renderIcon({ name: 'plus', className: 'ds-accordion-summary__plus' })}${renderIcon({ name: 'minus', className: 'ds-accordion-summary__minus' })}`;
  return `<summary class="${classes}"><span class="ds-accordion-summary__text">${escapeHtml(text)}</span><span class="ds-accordion-summary__icon" aria-hidden="true">${icons}</span></summary>`;
}

export function renderAccordionItem({ question = DEFAULT_FAQ[0].question, answer = DEFAULT_FAQ[0].answer, open = false } = {}) {
  return `<details class="ds-details ds-accordion__item"${open ? ' open' : ''}>${renderAccordionSummary({ text: question, className: 'ds-accordion__summary' })}<div class="ds-accordion__answer">${renderText({ text: answer, variant: 'body' })}</div></details>`;
}

// The list. Two columns (desktop FAQ grid): the first half of the items in the left column, the rest on the right;
// below 782 px the columns stack into one list.
export function renderAccordion({ items = DEFAULT_FAQ, variant = 'one-column', single = false } = {}) {
  const variantName = ACCORDION_VARIANTS.includes(variant) ? variant : 'one-column';
  const rendered = items.map((item) => renderAccordionItem(item));
  const columns =
    variantName === 'two-columns'
      ? [rendered.slice(0, Math.ceil(rendered.length / 2)), rendered.slice(Math.ceil(rendered.length / 2))]
      : [rendered];
  const body = columns.map((column) => `<div class="ds-accordion__column">${column.join('')}</div>`).join('');
  return `<div class="ds-accordion ds-accordion--${variantName}" data-ds-accordion${single ? ' data-ds-single' : ''}>${body}</div>`;
}
