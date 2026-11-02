// Card/Testimonial: a client quote. Figma: Molecules → Card/Testimonial (95:118, State Default / Active). DCC:
// blocks/opinie (.dcc-opinia). A <figure>: the accent quote mark, the <blockquote>, and a <figcaption> with the photo,
// the author and the role. Active (the centre slide, set by the carousel; or a product page card on hover/focus) is the
// primary card with on-brand text. Composes the Text atom.
import { escapeHtml } from '../../_shared/escape.js';
import { renderText } from '../../atoms/text/text.template.js';

// The two speech bubbles of the Figma quote mark (135 × 82), in currentColor (accent).
const QUOTE_MARK =
  '<svg class="ds-card-testimonial__mark" viewBox="0 0 135 82" fill="currentColor" aria-hidden="true" focusable="false"><path d="M32.5 60.94C50.45 60.94 65 47.3 65 30.47 65 13.64 50.45 0 32.5 0 14.55 0 0 13.64 0 30.47c0 16.83 14.55 30.47 32.5 30.47Z"/><path d="M35.61 81.56 31 45l26 5.58-21.39 30.98Z"/><path d="M102.5 60.94c17.95 0 32.5-13.64 32.5-30.47C135 13.64 120.45 0 102.5 0 84.55 0 70 13.64 70 30.47c0 16.83 14.55 30.47 32.5 30.47Z"/><path d="M105.61 81.56 101 45l26 5.58-21.39 30.98Z"/></svg>';

export function renderCardTestimonial({
  quote = 'Współpraca z DCC pomogła nam uporządkować komunikację w zespole i jasno podzielić odpowiedzialności. Warsztaty były konkretne, osadzone w naszej branży i od razu przełożyły się na codzienną pracę.',
  author = 'Agnieszka Nowicka-Petri',
  role = 'Dyrektor HR, Cardiac-Technika',
  photo = './placeholders/avatar.svg',
  active = false,
} = {}) {
  const photoMarkup = photo ? `<img class="ds-card-testimonial__photo" src="${escapeHtml(photo)}" alt="" loading="lazy">` : '';
  const name = `<span class="ds-card-testimonial__name">${renderText({ text: author, variant: 'xl', tag: 'span', className: 'ds-card-testimonial__author' })}${role ? renderText({ text: role, variant: 'body', tag: 'span', className: 'ds-card-testimonial__role' }) : ''}</span>`;
  return `<figure class="ds-card-testimonial${active ? ' is-active' : ''}"><div class="ds-card-testimonial__top">${QUOTE_MARK}</div><blockquote class="ds-card-testimonial__quote">${renderText({ text: quote, variant: 'body' })}</blockquote><figcaption class="ds-card-testimonial__caption">${photoMarkup}${name}</figcaption></figure>`;
}
