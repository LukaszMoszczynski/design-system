// Testimonials template: pure markup (the carousel's centred mode is tested in carousel.test.js).
import { describe, expect, it } from 'vitest';
import { DEFAULT_TESTIMONIALS, renderTestimonials } from '../../components/sections/testimonials/testimonials.template.js';

describe('testimonials template', () => {
  it('a centred heading with the reveal hook, then a centred three-up carousel of testimonial cards', () => {
    const markup = renderTestimonials();
    expect(markup).toMatch(/<div class="ds-testimonials__head" data-ds-reveal><header class="ds-heading-group ds-heading-group--centered">/);
    expect(markup).toContain('data-ds-items="3"');
    expect(markup).toContain('data-ds-nav="below"');
    expect(markup).toContain('data-ds-centered');
    expect(markup).toContain('data-ds-mobile-arrows="off"');
    expect(markup.match(/<figure class="ds-card-testimonial">/g)).toHaveLength(DEFAULT_TESTIMONIALS.length);
    // The carousel draws the active card; no card is active in the markup.
    expect(markup).not.toContain('ds-card-testimonial is-active');
    // The heading sits outside the carousel, which is named by the title.
    expect(markup).not.toContain('ds-carousel__head');
    expect(markup).toContain('aria-label="Co mówią nasi klienci o współpracy z DCC?"');
  });

  it('every card gets the shared photo unless it has its own; ariaLabel names the region', () => {
    const markup = renderTestimonials({ items: [{ quote: 'A', author: 'B', role: 'C' }, { quote: 'D', author: 'E', role: 'F', photo: 'e.jpg' }], photo: 'p.jpg', ariaLabel: 'Opinie' });
    expect(markup).toContain('src="p.jpg"');
    expect(markup).toContain('src="e.jpg"');
    expect(markup).toContain('aria-label="Opinie"');
  });

  it('falls back to h2 and escapes text', () => {
    const markup = renderTestimonials({ headingTag: 'h6', title: '<b>"T"</b>', items: [{ quote: 'A & B', author: 'x', role: 'y' }] });
    expect(markup).toContain('<h2 class="ds-text ds-text--3xl ds-heading-group__title">&lt;b&gt;&quot;T&quot;&lt;/b&gt;</h2>');
    expect(markup).toContain('A &amp; B');
  });
});
