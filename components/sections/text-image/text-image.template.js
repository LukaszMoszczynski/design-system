// Text + image: a Heading group, prose and actions beside or above photos. Figma: Sections → Section/Text + image
// (91:219). DCC: blocks/tekst-obraz (render.php, style.css; obraz-prawo, obraz-lewo, panorama, srodek, zdjecia).
// variant (Figma Variant):
// - image-right / image-left: two equal columns 72 px apart, the text beside a 4:3 photo (radius 32). Image left carries
//   the numbered steps (Letter circle + 2XL text, 1 px dividers);
// - panorama: the heading | a 365 px aside (prose + uppercase text links), then a 1200 × 518 photo (radius 28);
// - centered: centred text in 900 px over a faint background illustration, an accent uppercase button;
// - photos: a wide heading, 120 px gap, then a row photo · soft card · photo with the accent Badge/Circular on the card.
// Each variant has its own Polish copy (TEXT_IMAGE_COPY); a non-empty arg wins. The text and the photos carry
// data-ds-reveal (base/reveal.js lifts them in with GSAP, as the site's data-reveal).
// Composes Heading group, Text, Button, Link, Letter circle and Badge/Circular.
import { escapeHtml } from '../../_shared/escape.js';
import { renderButton } from '../../atoms/button/button.template.js';
import { renderLink } from '../../atoms/link/link.template.js';
import { renderLetterCircle } from '../../atoms/number/number.template.js';
import { renderText } from '../../atoms/text/text.template.js';
import { renderBadgeCircular } from '../../molecules/badge-circular/badge-circular.template.js';
import { renderHeadingGroup } from '../../molecules/heading-group/heading-group.template.js';

export const TEXT_IMAGE_VARIANTS = ['image-right', 'image-left', 'panorama', 'centered', 'photos'];
export const TEXT_IMAGE_HEADING_TAGS = ['h2', 'h3'];

const ABOUT = 'Pracujemy z firmami technologicznymi, produkcyjnymi i usługowymi. Łączymy doświadczenie menedżerskie z warsztatem coachingowym, dlatego nasze programy są praktyczne, osadzone w realiach biznesu i mierzone efektami.';

export const TEXT_IMAGE_COPY = {
  'image-right': { overline: 'O nas', title: 'Partnerzy w rozwoju organizacji', text: ABOUT, steps: [], actions: [{ text: 'Poznaj nasz zespół', href: '#' }] },
  'image-left': {
    overline: 'O nas',
    title: 'Partnerzy w rozwoju organizacji',
    text: '',
    steps: ['Diagnoza potrzeb i celów', 'Program szyty na miarę', 'Warsztaty i wdrożenie', 'Mierzenie efektów'],
    actions: [],
  },
  panorama: {
    overline: 'O nas',
    title: 'Towarzyszy nam silna ekipa',
    text: 'Zespół trenerów, coachów i konsultantów, którzy łączą praktykę menedżerską z warsztatem rozwojowym. Pracujemy razem od 2008 roku.',
    steps: [],
    actions: [{ text: 'Poznaj zespół', href: '#' }, { text: 'Zadzwoń', href: 'tel:+48000000000' }],
  },
  centered: {
    overline: 'Szkolenia otwarte',
    title: '#rozwijamySzczecin',
    text: 'Dołącz do najbliższego szkolenia otwartego w Szczecinie – poznaj aktualne terminy, tematy i prowadzących.',
    steps: [],
    actions: [{ text: 'Zobacz terminy', href: '#' }],
  },
  photos: {
    overline: 'Zespoły',
    title: 'Już ponad 100 zespołów pracowało z nami nad tym, jak grać do jednej bramki',
    text: 'Warsztaty zespołowe, team coaching i diagnoza ról – pracujemy z zespołami sprzedaży, produkcji i IT, które chcą lepiej współpracować.',
    steps: [],
    actions: [],
  },
};

// The Button style per variant (DCC render.php: srodek → sygnatura, otherwise primary, the second one jasny).
const BUTTON_STYLES = { centered: ['accent', 'light'] };

function renderActions(variant, actions) {
  if (!actions.length) return '';
  if (variant === 'panorama') {
    return `<div class="ds-text-image__links">${actions.map((action) => renderLink({ text: action.text, href: action.href ?? '#', variant: 'arrow' })).join('')}</div>`;
  }
  const [first, rest] = BUTTON_STYLES[variant] ?? ['primary', 'light'];
  return `<div class="ds-text-image__buttons">${actions.map((action, index) => renderButton({ text: action.text, href: action.href ?? '', variant: index === 0 ? first : rest })).join('')}</div>`;
}

function renderSteps(steps) {
  if (!steps.length) return '';
  const items = steps
    .map((step, index) => `<li class="ds-text-image__step">${renderLetterCircle({ text: String(index + 1) })}${renderText({ text: step, variant: '2xl', tag: 'span', className: 'ds-text-image__step-text' })}</li>`)
    .join('');
  return `<ol class="ds-text-image__steps" role="list">${items}</ol>`;
}

// A photo frame: the image when given, otherwise the empty soft frame (Figma's "Photo (replace fill)").
function renderMedia(image, imageAlt, className) {
  const photo = image ? `<img class="ds-text-image__image" src="${escapeHtml(image)}" alt="${escapeHtml(imageAlt)}" loading="lazy">` : '';
  const classes = ['ds-text-image__media', className].filter(Boolean).join(' ');
  return `<figure class="${classes}" data-ds-reveal>${photo}</figure>`;
}

export function renderTextImage({
  variant = 'image-right',
  overline,
  title,
  text,
  steps,
  actions,
  image = '',
  imageAlt = '',
  image2 = '',
  image2Alt = '',
  background = '',
  badgeText = 'Wyzwanie? Znajdziemy rozwiązanie',
  headingTag = 'h2',
} = {}) {
  const variantName = TEXT_IMAGE_VARIANTS.includes(variant) ? variant : 'image-right';
  const copy = TEXT_IMAGE_COPY[variantName];
  const tag = TEXT_IMAGE_HEADING_TAGS.includes(headingTag) ? headingTag : 'h2';
  const heading = renderHeadingGroup({
    overline: overline ?? copy.overline,
    title: title || copy.title,
    lead: '',
    leadStrong: '',
    variant: variantName === 'centered' ? 'centered' : 'stacked',
    headingTag: tag,
  });
  const bodyText = text ?? copy.text;
  const prose = bodyText ? renderText({ text: bodyText, variant: variantName === 'centered' ? 'question' : 'body', className: 'ds-text-image__prose' }) : '';
  const actionMarkup = renderActions(variantName, actions ?? copy.actions);
  const classes = `ds-text-image ds-text-image--${variantName}`;

  if (variantName === 'photos') {
    const card = `<div class="ds-text-image__card">${prose}${badgeText ? renderBadgeCircular({ text: badgeText, className: 'ds-text-image__badge' }) : ''}</div>`;
    return `<section class="${classes}"><div class="ds-text-image__container"><div class="ds-text-image__head" data-ds-reveal>${heading}</div></div><div class="ds-text-image__trio">${renderMedia(image, imageAlt, 'ds-text-image__media--first')}${card}${renderMedia(image2, image2Alt, 'ds-text-image__media--last')}</div></section>`;
  }

  if (variantName === 'panorama') {
    const split = `<div class="ds-text-image__split" data-ds-reveal>${heading}<div class="ds-text-image__aside">${prose}${actionMarkup}</div></div>`;
    return `<section class="${classes}"><div class="ds-text-image__container">${split}${renderMedia(image, imageAlt, 'ds-text-image__media--wide')}</div></section>`;
  }

  const textColumn = `<div class="ds-text-image__text" data-ds-reveal>${heading}${prose}${renderSteps(steps ?? copy.steps)}${actionMarkup}</div>`;
  if (variantName === 'centered') {
    const art = background ? `<img class="ds-text-image__background" src="${escapeHtml(background)}" alt="" loading="lazy">` : '';
    return `<section class="${classes}">${art}<div class="ds-text-image__container">${textColumn}</div></section>`;
  }
  return `<section class="${classes}"><div class="ds-text-image__container ds-text-image__grid">${textColumn}${renderMedia(image, imageAlt, '')}</div></section>`;
}
