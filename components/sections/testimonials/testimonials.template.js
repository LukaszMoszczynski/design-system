// Testimonials: the "Rekomendacje" carousel. Figma: Sections → Section/Testimonials (95:227). DCC: blocks/opinie
// (.dcc-opinie, dcc_carousel_open(3, …, centered)).
// A centred Heading group (84 px above the slides, data-ds-reveal) and the Carousel organism with centered on: three
// whole Card/Testimonial slides from 1200 px, the middle one active (carousel.js puts is-active on it), the controls
// 64 px below. Phones: the heading on the left, one card with the next peeking, dots only.
// The carousel loops from 6 testimonials (two × the 3 in view), else the arrows rewind.
// Composes Heading group, Carousel (Carousel controls) and Card/Testimonial.
import { renderHeadingGroup } from '../../molecules/heading-group/heading-group.template.js';
import { renderCardTestimonial } from '../../molecules/card-testimonial/card-testimonial.template.js';
import { renderCarousel } from '../../organisms/carousel/carousel.template.js';

export const TESTIMONIALS_HEADING_TAGS = ['h2', 'h3'];

export const DEFAULT_TESTIMONIALS = [
  {
    quote: 'Współpraca z DCC pomogła nam uporządkować komunikację w zespole i jasno podzielić odpowiedzialności. Warsztaty były konkretne, osadzone w naszej branży i od razu przełożyły się na codzienną pracę.',
    author: 'Agnieszka Nowicka-Petri',
    role: 'Dyrektor HR, Cardiac-Technika',
  },
  {
    quote: 'Program dla kierowników zmian dał naszym liderom wspólny język. Po trzech modułach widzimy mniej eskalacji i spokojniejsze odprawy na produkcji.',
    author: 'Tomasz Wieczorek',
    role: 'Dyrektor zakładu, Elmet',
  },
  {
    quote: 'Trenerzy szybko zrozumieli specyfikę zespołu IT. Ćwiczenia były na naszych przykładach, a nie z podręcznika, i to zrobiło różnicę.',
    author: 'Marta Zielińska',
    role: 'Head of Engineering, Softline',
  },
  {
    quote: 'Coaching zarządu był dla nas momentem, w którym naprawdę zaczęliśmy rozmawiać o strategii, a nie tylko o bieżących sprawach.',
    author: 'Piotr Kamiński',
    role: 'Prezes zarządu, Portum',
  },
  {
    quote: 'Szkolenie z negocjacji przygotowało handlowców do trudnych rozmów z klientami. Wyniki kwartału mówią same za siebie.',
    author: 'Katarzyna Lis',
    role: 'Dyrektor sprzedaży, Agrovita',
  },
  {
    quote: 'Diagnoza ról w zespole pokazała, gdzie tracimy energię. Dziś lepiej dzielimy zadania i rzadziej się dublujemy.',
    author: 'Michał Nowak',
    role: 'Kierownik projektu, Baltic Logistics',
  },
];

export function renderTestimonials({
  overline = 'Rekomendacje',
  title = 'Co mówią nasi klienci o współpracy z DCC?',
  lead = '',
  items = DEFAULT_TESTIMONIALS,
  photo = './placeholders/avatar.svg',
  headingTag = 'h2',
  ariaLabel = '',
} = {}) {
  const tag = TESTIMONIALS_HEADING_TAGS.includes(headingTag) ? headingTag : 'h2';
  const heading = renderHeadingGroup({ overline, title, lead, leadStrong: '', variant: 'centered', headingTag: tag });
  const slides = items.map((item) => renderCardTestimonial({ photo, ...item, active: false }));
  const carousel = renderCarousel({ slides, items: 3, nav: 'below', heading: null, centered: true, ariaLabel: ariaLabel || title || 'Opinie klientów' });
  return `<section class="ds-testimonials"><div class="ds-testimonials__container"><div class="ds-testimonials__head" data-ds-reveal>${heading}</div>${carousel}</div></section>`;
}
