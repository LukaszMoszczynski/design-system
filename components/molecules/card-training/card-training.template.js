// Card/Training: one training inside a program block. Figma: Molecules → Card/Training (130:194). DCC: blocks/programy.
// Variants:
// - carousel: a card-colour card in the programs carousel (label, name, text, recommended time);
// - column: a wide soft card with the button (two-column programs);
// - featured: a soft card with the stepped title tab, the check list, the benefit pills and the time;
// - row: the folded list on phones, a native <details> (Figma Row collapsed / expanded; accordion.js animates it
//   with GSAP when present).
// Composes Text, Check item list, Tag (outline), Button and the plus/minus Icons.
import { escapeHtml } from '../../_shared/escape.js';
import { renderButton } from '../../atoms/button/button.template.js';
import { renderIcon } from '../../atoms/icon/icon.template.js';
import { renderTag } from '../../atoms/tag/tag.template.js';
import { renderText } from '../../atoms/text/text.template.js';
import { CARD_HEADING_TAGS } from '../card-program/card-program.template.js';
import { renderCheckList } from '../check-item/check-item.template.js';

export const CARD_TRAINING_VARIANTS = ['carousel', 'column', 'featured', 'row'];

export function renderCardTraining({
  variant = 'carousel',
  label = 'Komunikacja i feedback',
  name = 'Trudne rozmowy w zespole',
  text = 'Jak mówić o błędach, oczekiwaniach i granicach tak, by relacja się nie posypała.',
  time = 'Rekomendowany czas: 1 dzień',
  title = 'Szczególnie polecamy, gdy:',
  reasons = ['awansujesz specjalistów na liderów', 'zespół rośnie szybciej niż procesy', 'chcesz jednego standardu zarządzania'],
  benefits = ['Pewność w pierwszych rozmowach 1:1', 'Delegowanie bez mikrozarządzania', 'Feedback, który nie rani'],
  buttonText = 'Zapytaj o termin',
  href = '#kontakt',
  open = false,
  headingTag = 'h3',
} = {}) {
  const variantName = CARD_TRAINING_VARIANTS.includes(variant) ? variant : 'carousel';
  const tag = CARD_HEADING_TAGS.includes(headingTag) ? headingTag : 'h3';
  const labelMarkup = label ? renderText({ text: label, variant: 'lg', className: 'ds-card-training__label' }) : '';
  const nameMarkup = renderText({ text: name, variant: '2xl', tag, className: 'ds-card-training__name' });
  const textMarkup = text ? renderText({ text, variant: 'body', className: 'ds-card-training__text' }) : '';
  const timeMarkup = time ? renderText({ text: time, variant: 'body-bold', className: 'ds-card-training__time' }) : '';
  const button = buttonText && href ? `<div class="ds-card-training__actions">${renderButton({ text: buttonText, href })}</div>` : '';
  const classes = `ds-card-training ds-card-training--${variantName}`;

  if (variantName === 'row') {
    const icons = `<span class="ds-card-training__icon" aria-hidden="true">${renderIcon({ name: 'plus', className: 'ds-card-training__plus' })}${renderIcon({ name: 'minus', className: 'ds-card-training__minus' })}</span>`;
    return `<details class="${classes}"${open ? ' open' : ''}><summary class="ds-card-training__summary"><span class="ds-card-training__row-name">${escapeHtml(name)}</span>${icons}</summary><div class="ds-card-training__body">${textMarkup}${timeMarkup}${button}</div></details>`;
  }
  if (variantName === 'featured') {
    const reasonList = reasons.length ? `<div class="ds-card-training__reasons">${renderCheckList({ items: reasons })}</div>` : '';
    const pills = benefits.length
      ? `<ul class="ds-card-training__benefits" role="list">${benefits.map((benefit) => renderTag({ text: benefit, variant: 'outline', tag: 'li' })).join('')}</ul>`
      : '';
    const benefitsTitle = label ? `<p class="ds-card-training__benefits-title">${escapeHtml(label)}</p>` : '';
    return `<article class="${classes}"><div class="ds-card-training__tab">${renderText({ text: title, variant: 'xl', tag, className: 'ds-card-training__title' })}</div>${reasonList}${benefitsTitle}${pills}${timeMarkup}</article>`;
  }
  return `<article class="${classes}">${labelMarkup}${nameMarkup}${textMarkup}${variantName === 'column' ? button : timeMarkup}</article>`;
}
