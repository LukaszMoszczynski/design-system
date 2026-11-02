// Accordion/Challenge: the "which challenge is yours" rows. Figma: Molecules → Accordion/Challenge (25:211).
// DCC: blocks/lista-wyzwan (.dcc-lista-wyzwan__item). Native <details>: works without JS; items of one list share a
// `name`, so the browser keeps one open at a time (exclusive accordion). Every item starts closed.
// Composes the plus/minus Icons, the Text atom (answer) and the Link atom (inverse: white on the open blue row).
import { escapeHtml } from '../../_shared/escape.js';
import { renderIcon } from '../../atoms/icon/icon.template.js';
import { renderLink } from '../../atoms/link/link.template.js';
import { renderText } from '../../atoms/text/text.template.js';

export const DEFAULT_CHALLENGES = [
  { question: 'Ludzie się po prostu nie dogadują', answer: 'Komunikacja się rwie, decyzje grzęzną i nie wiadomo, kto właściwie za co odpowiada. Zamiast współpracy pojawiają się napięcia i ciche pretensje.', linkText: 'Zobacz program', href: '#' },
  { question: 'Szef jest przeciążony', answer: 'Wszystko spływa na jedną osobę, a zespół czeka na decyzje. Brakuje delegowania i jasnych priorytetów.', linkText: 'Zobacz program', href: '#' },
  { question: 'Sprzedaż stoi w miejscu', answer: 'Handlowcy mają wiedzę o produkcie, ale rozmowy kończą się rabatem albo odłożeniem decyzji.', linkText: 'Zobacz program', href: '#' },
];

export function renderAccordionChallenge({
  question = DEFAULT_CHALLENGES[0].question,
  answer = DEFAULT_CHALLENGES[0].answer,
  linkText = DEFAULT_CHALLENGES[0].linkText,
  href = DEFAULT_CHALLENGES[0].href,
  name = '',
  open = false,
} = {}) {
  const icons = `<span class="ds-accordion-challenge__icon" aria-hidden="true">${renderIcon({ name: 'plus', className: 'ds-accordion-challenge__plus' })}${renderIcon({ name: 'minus', className: 'ds-accordion-challenge__minus' })}</span>`;
  const link = href ? renderLink({ text: linkText, href, variant: 'inverse' }) : '';
  const answerText = answer ? renderText({ text: answer, variant: 'body', className: 'ds-accordion-challenge__text' }) : '';
  const nameAttribute = name ? ` name="${escapeHtml(name)}"` : '';
  return `<details class="ds-accordion-challenge"${nameAttribute}${open ? ' open' : ''}><summary class="ds-accordion-challenge__summary">${icons}<span class="ds-accordion-challenge__question">${escapeHtml(question)}</span></summary><div class="ds-accordion-challenge__body">${answerText}${link}</div></details>`;
}

// The list: rows 22 px apart (desktop), dividers only on phones. `name` groups the items (one open at a time).
export function renderAccordionChallengeList({ items = DEFAULT_CHALLENGES, name = 'wyzwania' } = {}) {
  return `<div class="ds-accordion-challenge-list">${items.map((item) => renderAccordionChallenge({ ...item, name })).join('')}</div>`;
}
