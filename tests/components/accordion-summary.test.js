// The plus/minus question row is one shared piece: Accordion, Accordion/Challenge and the Card/Training row all print
// renderAccordionSummary on a .ds-details element, the swap CSS lives once in accordion.css, and accordion.js drives
// is-closing on all three.
import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it } from 'vitest';
import { Window } from 'happy-dom';
import { loadScript } from '../helpers/load-script.js';
import { renderAccordionItem, renderAccordionSummary } from '../../components/molecules/accordion/accordion.template.js';
import { renderAccordionChallenge } from '../../components/molecules/accordion-challenge/accordion-challenge.template.js';
import { renderCardTraining } from '../../components/molecules/card-training/card-training.template.js';

const SCRIPT = 'components/molecules/accordion/accordion.js';
const TEXT = 'Pytanie?';
const MOLECULES = {
  accordion: { markup: () => renderAccordionItem({ question: TEXT }), className: 'ds-accordion__summary' },
  challenge: { markup: () => renderAccordionChallenge({ question: TEXT }), className: 'ds-accordion-challenge__summary' },
  'training row': { markup: () => renderCardTraining({ variant: 'row', name: TEXT }), className: 'ds-card-training__summary' },
};

describe('shared accordion summary', () => {
  let window;
  let document;

  beforeEach(() => {
    window = new Window();
    document = window.document;
  });

  for (const [name, molecule] of Object.entries(MOLECULES)) {
    it(`${name} renders the shared summary on a .ds-details element`, () => {
      document.body.innerHTML = molecule.markup();
      const details = document.querySelector('details');
      expect(details.classList.contains('ds-details')).toBe(true);
      // Both sides through the same parser, so the serialisation (self-closing SVG paths) matches.
      const expected = document.createElement('div');
      expected.innerHTML = renderAccordionSummary({ text: TEXT, className: molecule.className });
      expect(details.querySelector(':scope > summary').outerHTML).toBe(expected.firstElementChild.outerHTML);
    });

    it(`${name} follows is-closing (animated close keeps the open look until the tween ends)`, () => {
      const tweens = [];
      window.gsap = { fromTo: (target, from, to) => tweens.push(to), killTweensOf() {} };
      document.body.innerHTML = molecule.markup();
      loadScript(SCRIPT, window);
      const details = document.querySelector('details');
      const summary = details.querySelector('summary');
      summary.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
      tweens.shift().onComplete?.();
      expect(details.open).toBe(true);
      summary.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
      expect(details.open).toBe(true);
      expect(details.classList.contains('is-closing')).toBe(true);
      tweens.shift().onComplete();
      expect(details.open).toBe(false);
      expect(details.classList.contains('is-closing')).toBe(false);
    });
  }

  it('keeps the plus/minus swap in one stylesheet', () => {
    const shared = readFileSync('components/molecules/accordion/accordion.css', 'utf8');
    expect(shared).toContain('.ds-details[open]:not(.is-closing) > .ds-accordion-summary .ds-accordion-summary__plus');
    for (const file of ['accordion-challenge/accordion-challenge.css', 'card-training/card-training.css']) {
      const css = readFileSync(`components/molecules/${file}`, 'utf8');
      expect(css).not.toMatch(/__(plus|minus)\b/);
      expect(css).not.toContain('::-webkit-details-marker');
    }
  });
});
