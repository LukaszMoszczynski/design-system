// FAQ template: pure markup (the accordion and the reveal have their own script tests).
import { describe, expect, it } from 'vitest';
import { renderFaq } from '../../components/sections/faq/faq.template.js';

describe('faq template', () => {
  it('renders the heading group with the reveal hook above a two-column accordion, every item closed', () => {
    const markup = renderFaq();
    expect(markup).toContain('ds-faq--two-columns');
    expect(markup).toMatch(/<div class="ds-faq__head" data-ds-reveal><header class="ds-heading-group ds-heading-group--stacked">/);
    expect(markup).toContain('ds-accordion--two-columns');
    expect(markup.match(/<div class="ds-accordion__column">/g)).toHaveLength(2);
    expect(markup).not.toMatch(/<details[^>]* open/);
  });

  it('one column and single pass through to the accordion', () => {
    const markup = renderFaq({ variant: 'one-column', single: true, items: [{ question: 'P?', answer: 'O.' }] });
    expect(markup).toContain('ds-accordion--one-column');
    expect(markup).toContain('data-ds-single');
    expect(markup.match(/<details/g)).toHaveLength(1);
  });

  it('falls back to two columns and h2, and escapes text', () => {
    const markup = renderFaq({ variant: 'grid', headingTag: 'h1', title: '<b>"T"</b>', items: [{ question: 'A & B', answer: 'x' }] });
    expect(markup).toContain('ds-faq--two-columns');
    expect(markup).toContain('<h2 class="ds-text ds-text--3xl ds-heading-group__title">&lt;b&gt;&quot;T&quot;&lt;/b&gt;</h2>');
    expect(markup).toContain('A &amp; B');
  });
});
