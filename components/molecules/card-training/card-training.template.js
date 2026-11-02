// Card/Training: one training inside a program block. Figma: Molecules → Card/Training (130:194). DCC: blocks/programy.
// Variants:
// - carousel: a card-colour card in the programs carousel (overline, name, text, recommended time);
// - column: a wide soft card with the button (two-column programs);
// - featured: a soft card with the stepped title tab, the check list, the Benefits and the time;
// - row: the folded list on phones, a native <details> with the shared Accordion summary (Figma Row collapsed /
//   expanded; accordion.js animates it with GSAP when present).
// Composes Text, Check item list, Benefits, Button and the Accordion summary.
import { CARD_HEADING_TAGS } from '../../_shared/heading-tags.js';
import { renderButton } from '../../atoms/button/button.template.js';
import { renderText } from '../../atoms/text/text.template.js';
import { renderAccordionSummary } from '../accordion/accordion.template.js';
import { renderBenefits } from '../benefits/benefits.template.js';
import { renderCheckList } from '../check-item/check-item.template.js';

export const CARD_TRAINING_VARIANTS = ['carousel', 'column', 'featured', 'row'];

export function renderCardTraining({
  variant = 'carousel',
  overline = 'Komunikacja i feedback',
  name = 'Trudne rozmowy w zespole',
  text = 'Jak mówić o błędach, oczekiwaniach i granicach tak, by relacja się nie posypała.',
  time = 'Rekomendowany czas: 1 dzień',
  title = 'Szczególnie polecamy, gdy:',
  reasons = ['awansujesz specjalistów na liderów', 'zespół rośnie szybciej niż procesy', 'chcesz jednego standardu zarządzania'],
  benefitsTitle = 'Komunikacja i feedback',
  benefits = ['Pewność w pierwszych rozmowach 1:1', 'Delegowanie bez mikrozarządzania', 'Feedback, który nie rani'],
  buttonText = 'Zapytaj o termin',
  href = '#kontakt',
  open = false,
  headingTag = 'h3',
} = {}) {
  const variantName = CARD_TRAINING_VARIANTS.includes(variant) ? variant : 'carousel';
  const tag = CARD_HEADING_TAGS.includes(headingTag) ? headingTag : 'h3';
  const overlineMarkup = overline ? renderText({ text: overline, variant: 'lg', className: 'ds-card-training__overline' }) : '';
  const nameMarkup = renderText({ text: name, variant: '2xl', tag, className: 'ds-card-training__name' });
  const textMarkup = text ? renderText({ text, variant: 'body', className: 'ds-card-training__text' }) : '';
  const timeMarkup = time ? renderText({ text: time, variant: 'body-bold', className: 'ds-card-training__time' }) : '';
  const button = buttonText && href ? `<div class="ds-card-training__actions">${renderButton({ text: buttonText, href })}</div>` : '';
  const classes = `ds-card-training ds-card-training--${variantName}`;

  if (variantName === 'row') {
    return `<details class="ds-details ${classes}"${open ? ' open' : ''}>${renderAccordionSummary({ text: name, className: 'ds-card-training__summary' })}<div class="ds-card-training__body">${textMarkup}${timeMarkup}${button}</div></details>`;
  }
  if (variantName === 'featured') {
    const reasonList = reasons.length ? `<div class="ds-card-training__reasons">${renderCheckList({ items: reasons })}</div>` : '';
    const benefitsBlock = benefitsTitle || benefits.length ? renderBenefits({ title: benefitsTitle, items: benefits }) : '';
    return `<article class="${classes}"><div class="ds-card-training__tab">${renderText({ text: title, variant: 'xl', tag, className: 'ds-card-training__title' })}</div>${reasonList}${benefitsBlock}${timeMarkup}</article>`;
  }
  return `<article class="${classes}">${overlineMarkup}${nameMarkup}${textMarkup}${variantName === 'column' ? button : timeMarkup}</article>`;
}
