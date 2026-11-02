// Accordion: FAQ rows on native <details>/<summary>, so they open and close without JS.
// Figma: Molecules → Accordion/Item (10:54) and Accordion (10:121, Layout Two columns / One column). DCC: blocks/faq.
// The Icon atom draws the plus and the minus; CSS shows one or the other from [open]. Every item starts closed
// (Figma's open first row is an example). accordion.js: data-ds-single keeps one item open per list; with GSAP it
// animates the height.
import { escapeHtml } from '../../_shared/escape.js';
import { renderIcon } from '../../atoms/icon/icon.template.js';
import { renderText } from '../../atoms/text/text.template.js';

export const ACCORDION_LAYOUTS = ['one-column', 'two-columns'];

export const DEFAULT_FAQ = [
  { question: 'Jak wygląda pierwsze spotkanie z trenerem?', answer: 'Zaczynamy od krótkiej rozmowy o celach i sytuacji zespołu. Na tej podstawie trener dobiera ćwiczenia i przykłady z Waszej branży.' },
  { question: 'Czy szkolenie może odbyć się w naszej siedzibie?', answer: 'Tak. Przyjeżdżamy do Waszego biura w całej Polsce albo prowadzimy warsztat w wynajętej sali.' },
  { question: 'Ile osób może wziąć udział w warsztacie?', answer: 'Najlepiej pracuje się w grupie od 8 do 14 osób, tak by każdy miał czas na ćwiczenia.' },
  { question: 'Czy po szkoleniu otrzymamy materiały?', answer: 'Każdy uczestnik dostaje skrypt z ćwiczeniami i listę narzędzi do dalszej pracy.' },
  { question: 'Jak długo trwa jeden moduł?', answer: 'Moduł to zwykle jeden dzień warsztatów, czyli 7 godzin z przerwami.' },
  { question: 'Czy wystawiacie certyfikaty uczestnictwa?', answer: 'Tak, każdy uczestnik otrzymuje imienny certyfikat po zakończeniu programu.' },
];

export function renderAccordionItem({ question = DEFAULT_FAQ[0].question, answer = DEFAULT_FAQ[0].answer, open = false } = {}) {
  const icons = `<span class="ds-accordion__icon" aria-hidden="true">${renderIcon({ name: 'plus', className: 'ds-accordion__plus' })}${renderIcon({ name: 'minus', className: 'ds-accordion__minus' })}</span>`;
  return `<details class="ds-accordion__item"${open ? ' open' : ''}><summary class="ds-accordion__summary"><span class="ds-accordion__question">${escapeHtml(question)}</span>${icons}</summary><div class="ds-accordion__answer">${renderText({ text: answer, variant: 'body' })}</div></details>`;
}

// The list. Two columns (desktop FAQ grid): the first half of the items in the left column, the rest on the right;
// below 782 px the columns stack into one list.
export function renderAccordion({ items = DEFAULT_FAQ, layout = 'one-column', single = false } = {}) {
  const layoutName = ACCORDION_LAYOUTS.includes(layout) ? layout : 'one-column';
  const rendered = items.map((item) => renderAccordionItem(item));
  const columns =
    layoutName === 'two-columns'
      ? [rendered.slice(0, Math.ceil(rendered.length / 2)), rendered.slice(Math.ceil(rendered.length / 2))]
      : [rendered];
  const body = columns.map((column) => `<div class="ds-accordion__column">${column.join('')}</div>`).join('');
  return `<div class="ds-accordion ds-accordion--${layoutName}" data-ds-accordion${single ? ' data-ds-single' : ''}>${body}</div>`;
}
