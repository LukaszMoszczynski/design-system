// Call to action: the contact prompt between sections. Figma: Organisms → Call to action (28:968, five variants).
// DCC: blocks/wezwanie (render.php, style.css).
// variant (Figma Variant): large (brand card, title on page-colour boxes, photo + Badge/Circular), band (accent card,
// centred), gradient (deep → primary card, two columns), image (accent question, text links, wide photo), light (soft
// centred box). Each variant has its own Polish copy (CTA_COPY); a given title / subtitle / text / buttons wins.
// buttons: [{ text, href }]; the variant picks the Button style (Light, Accent, Primary) or, for image, text links.
// The content carries data-ds-reveal: base/reveal.js lifts it in with GSAP when it scrolls into view.
// Composes Text, Button, Link and Badge/Circular.
import { escapeHtml } from '../../_shared/escape.js';
import { renderButton } from '../../atoms/button/button.template.js';
import { renderLink } from '../../atoms/link/link.template.js';
import { renderText } from '../../atoms/text/text.template.js';
import { renderBadgeCircular } from '../../molecules/badge-circular/badge-circular.template.js';

export const CTA_VARIANTS = ['large', 'band', 'gradient', 'image', 'light'];
export const CTA_HEADING_TAGS = ['h2', 'h3'];

const CONTACT = [
  { text: 'Tak! Dzwonię', href: 'tel:+48000000000' },
  { text: 'Tak! Piszę maila', href: 'mailto:kontakt@example.com' },
];

export const CTA_COPY = {
  large: {
    title: 'Nie wiesz, od czego zacząć?',
    subtitle: 'Napisz do nas, z czym się mierzysz, a my znajdziemy dla Ciebie rozwiązanie',
    text: 'Jeśli w naszej ofercie nie ma szkolenia, którego szukasz, to wskażemy najlepszych trenerów lub zbudujemy dla Ciebie adekwatny program rozwojowy.',
  },
  band: {
    title: 'Nie wiesz, który program wybrać?',
    subtitle: '',
    text: 'Zadzwoń lub napisz: podpowiemy, które szkolenie odpowiada na Wasze wyzwania, albo zbudujemy program szyty na miarę.',
  },
  gradient: {
    title: 'Od którego modułu zacząć?',
    subtitle: 'Program możesz zacząć od dowolnego modułu – dobierzemy kolejność do sytuacji Twojego zespołu i nie wymagamy udziału w całości.',
    text: 'Zadzwoń lub napisz – podpowiemy, który moduł odpowiada na Wasze wyzwania, albo zbudujemy program szyty na miarę. Pierwsza rozmowa jest bezpłatna i do niczego nie zobowiązuje.',
  },
  image: {
    title: 'Masz pytania? Porozmawiajmy o rozwoju Twojej firmy',
    subtitle: '',
    text: 'Zadzwoń lub napisz: podpowiemy, które szkolenie odpowiada na Wasze wyzwania, albo zbudujemy program szyty na miarę.',
  },
  light: {
    title: 'A Ty jakie masz wyzwania?',
    subtitle: '',
    text: 'Opowiedz nam o swoim zespole, a zaproponujemy program, który odpowiada na realne potrzeby – od pojedynczego warsztatu po wielomiesięczną akademię.',
  },
};

// The Button style of the first and the other buttons (DCC render.php: $first / $rest).
const BUTTON_STYLES = { large: ['light', 'light'], band: ['light', 'light'], gradient: ['accent', 'light'], light: ['accent', 'primary'] };
// Text styles of the title per variant (Text atom); the CSS adjusts weight and phone sizes.
const TITLE_STYLES = { large: 'number', band: 'xl', gradient: '4xl', image: '3xl', light: '3xl' };

function renderActions(variant, buttons) {
  if (!buttons.length) return '';
  if (variant === 'image') {
    return `<div class="ds-cta__links">${buttons.map((button) => renderLink({ text: button.text, href: button.href, variant: 'brand' })).join('')}</div>`;
  }
  const [first, rest] = BUTTON_STYLES[variant];
  return `<div class="ds-cta__buttons">${buttons.map((button, index) => renderButton({ text: button.text, href: button.href, variant: index === 0 ? first : rest })).join('')}</div>`;
}

export function renderCallToAction({
  variant = 'large',
  title,
  subtitle,
  text,
  buttons = CONTACT,
  image = '',
  imageAlt = '',
  badgeText = 'Wyzwanie? Znajdziemy rozwiązanie',
  headingTag = 'h2',
} = {}) {
  const variantName = CTA_VARIANTS.includes(variant) ? variant : 'large';
  const copy = CTA_COPY[variantName];
  const titleText = title ?? copy.title;
  const subtitleText = variantName === 'large' || variantName === 'gradient' ? (subtitle ?? copy.subtitle) : '';
  const bodyText = text ?? copy.text;
  const tag = CTA_HEADING_TAGS.includes(headingTag) ? headingTag : 'h2';

  // Large: the title words sit on page-colour boxes, one per line (box-decoration-break, .ds-cta__title-box); the inline
  // Text span inside carries the look and is positioned, so every line's text paints above the next line's box.
  const titleMarkup =
    variantName === 'large'
      ? `<${tag} class="ds-cta__title"><span class="ds-cta__title-box">${renderText({ text: titleText, variant: 'number', tone: 'accent', tag: 'span', className: 'ds-cta__title-text' })}</span></${tag}>`
      : renderText({ text: titleText, variant: TITLE_STYLES[variantName], tone: variantName === 'light' ? 'default' : 'inherit', tag, className: 'ds-cta__title' });
  const subtitleMarkup = subtitleText ? renderText({ text: subtitleText, variant: 'xl', className: 'ds-cta__subtitle' }) : '';
  const textMarkup = bodyText ? renderText({ text: bodyText, variant: 'body', className: 'ds-cta__text' }) : '';
  const actions = renderActions(variantName, buttons);

  let content;
  if (variantName === 'gradient') {
    content = `<div class="ds-cta__main">${titleMarkup}${actions}</div><div class="ds-cta__aside">${subtitleMarkup}${textMarkup}</div>`;
  } else if (variantName === 'image') {
    content = `${titleMarkup}<div class="ds-cta__aside">${textMarkup}${actions}</div>`;
  } else {
    content = `${titleMarkup}${subtitleMarkup}${textMarkup}${actions}`;
  }

  const photo = image ? `<img class="ds-cta__image" src="${escapeHtml(image)}" alt="${escapeHtml(imageAlt)}" loading="lazy">` : '';
  let media = '';
  if (variantName === 'large') media = `<figure class="ds-cta__media">${photo}${badgeText ? renderBadgeCircular({ text: badgeText, className: 'ds-cta__badge' }) : ''}</figure>`;
  if (variantName === 'image') media = `<figure class="ds-cta__media">${photo}</figure>`;

  return `<section class="ds-cta ds-cta--${variantName}"><div class="ds-cta__card"><div class="ds-cta__content" data-ds-reveal>${content}</div>${media}</div></section>`;
}
