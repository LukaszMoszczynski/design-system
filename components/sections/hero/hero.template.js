// Hero: the top of a page. Figma: Sections → Section/Hero (81:314). DCC: blocks/hero (.dcc-hero, render.php, style.css).
// variant (Figma Variant):
// - large: an 800 px brand box (a photo under a blue fade from the left), the 4XL white title with accent words, the
//   lead, an LG subtitle and a Light button; three Card/Hero tiles overlap the box bottom by 65 px;
// - contact: the same box with a wider fade, a large two-tone lead (white, then an accent sentence), the button 64 px down;
// - subpage-light, subpage-violet, subpage-orange: a 420 px gradient box (soft → primary with an illustration on the
//   right, deep → primary, accent → deep → primary), the accent 4XL title, a 3XL white lead and an accent 2XL subtitle.
// Phones: Large = the photo above a brand panel, the tiles stacked below; Subpage = breadcrumbs above the box, the title
// reads as an overline. Each variant has its own Polish copy (HERO_COPY); a non-empty arg wins.
// titleAccent / leadAccent: a part of the title / lead drawn in the accent colour (the site marks it in the field).
// Composes Text, Button (light), Card/Hero tile and Breadcrumbs. No JS: the site does not animate the hero (assets/js/app.js
// reveals every section but the hero).
import { escapeHtml } from '../../_shared/escape.js';
import { renderBreadcrumbs } from '../../atoms/breadcrumbs/breadcrumbs.template.js';
import { renderButton } from '../../atoms/button/button.template.js';
import { renderText } from '../../atoms/text/text.template.js';
import { renderCardHeroTile } from '../../molecules/card-hero-tile/card-hero-tile.template.js';

export const HERO_VARIANTS = ['large', 'contact', 'subpage-light', 'subpage-violet', 'subpage-orange'];
export const HERO_HEADING_TAGS = ['h1', 'h2'];

export const DEFAULT_HERO_TILES = [
  {
    title: 'Oferta szkoleń wewnętrznych',
    text: 'Poznaj nasze programy dla liderów, zespołów, specjalistów i zarządów – znajdź rozwiązanie dla swojej organizacji.',
    href: '#',
  },
  {
    title: 'Oferta szkoleń otwartych',
    hashtag: '#rozwijamySzczecin',
    text: 'Dołącz do najbliższego szkolenia – poznaj aktualne terminy i tematy najbliższych szkoleń.',
    href: '#',
  },
  {
    title: 'BLOG',
    hashtag: '#zdroweorganizacje',
    text: 'Praktyczna wiedza o przywództwie, komunikacji i budowaniu Zdrowych Organizacji.',
    href: '#',
  },
];

const SUBPAGE_COPY = {
  title: 'Rozwój liderów',
  titleAccent: '',
  lead: 'Programy dla liderów, menedżerów, brygadzistów, kierowników na każdym etapie rozwoju',
  leadAccent: '',
  subtitle: 'Od fundamentów przywództwa po zaawansowane strategie zarządzania',
  button: null,
};

export const HERO_COPY = {
  large: {
    title: 'Jak poukładać relacje i kompetencje w firmie, by wspólnie osiągać wyniki?',
    titleAccent: 'poukładać relacje i kompetencje',
    lead: 'Odpowiedź jest prosta – a jednocześnie trudna. Pomagamy liderom, menedżerom i zespołom rozwijać się w organizacjach technologicznych, produkcyjnych i usługowych. Pokazujemy, jak budować Zdrowe Organizacje.',
    leadAccent: '',
    subtitle: 'Szkolenia, coaching i consulting dla firm',
    button: { text: 'Chcę poznać ofertę', href: '#' },
  },
  contact: {
    title: 'Zapraszamy do nas',
    titleAccent: '',
    lead: 'Nasze biuro w centrum Szczecina to kameralna przestrzeń do rozmów coachingowych 1:1 oraz grupowej pracy rozwojowej. Umów się na sesję przy kawie osobiście, hybrydowo albo wyłącznie online, jeśli tak jest Tobie wygodniej.',
    leadAccent: 'Umów się na sesję przy kawie osobiście, hybrydowo albo wyłącznie online, jeśli tak jest Tobie wygodniej.',
    subtitle: '',
    button: { text: 'Jak dojechać', href: '#' },
  },
  'subpage-light': SUBPAGE_COPY,
  'subpage-violet': SUBPAGE_COPY,
  'subpage-orange': SUBPAGE_COPY,
};

// The text split round its first accent occurrence: [{ text, accent }], empty parts dropped.
export function accentParts(text, accent) {
  const at = accent ? text.indexOf(accent) : -1;
  if (at < 0) return [{ text, accent: false }];
  return [
    { text: text.slice(0, at), accent: false },
    { text: accent, accent: true },
    { text: text.slice(at + accent.length), accent: false },
  ].filter((part) => part.text !== '');
}

// A block whose text has an accent part: the wrapper carries the place, each part is an inline Text span.
function renderAccentText({ text, accent, variant, tag, className, tone = 'inherit' }) {
  const parts = accentParts(text, accent)
    .map((part) => renderText({ text: part.text, variant, tag: 'span', tone: part.accent ? 'accent' : tone }))
    .join('');
  return `<${tag} class="${className}">${parts}</${tag}>`;
}

export function renderHero({
  variant = 'large',
  title,
  titleAccent,
  lead,
  leadAccent,
  subtitle,
  button,
  tiles,
  image = '',
  imageAlt = '',
  illustration = '',
  breadcrumbs = [],
  headingTag = 'h1',
} = {}) {
  const variantName = HERO_VARIANTS.includes(variant) ? variant : 'large';
  const subpage = variantName.startsWith('subpage-');
  const copy = HERO_COPY[variantName];
  const titleText = title || copy.title;
  const leadText = lead || copy.lead;
  // An accent given with its own text applies to that text; the variant's accent only to the variant's own copy.
  const titleAccentText = titleAccent ?? (title ? '' : copy.titleAccent);
  const leadAccentText = leadAccent ?? (lead ? '' : copy.leadAccent);
  const subtitleText = subtitle ?? copy.subtitle;
  const buttonArgs = subpage ? null : button === undefined ? copy.button : button;
  const tileList = subpage ? [] : tiles ?? DEFAULT_HERO_TILES;
  const tag = HERO_HEADING_TAGS.includes(headingTag) ? headingTag : 'h1';

  const titleMarkup = renderAccentText({ text: titleText, accent: titleAccentText, variant: '4xl', tag, className: 'ds-hero__title' });
  const leadVariant = subpage ? '3xl' : 'body';
  const leadMarkup = leadText ? renderAccentText({ text: leadText, accent: leadAccentText, variant: leadVariant, tag: 'p', className: 'ds-hero__lead' }) : '';
  const subtitleMarkup = subtitleText
    ? renderText({ text: subtitleText, variant: subpage ? '2xl' : 'lg', tone: subpage ? 'accent' : 'inherit', className: 'ds-hero__subtitle' })
    : '';
  const buttonMarkup = buttonArgs?.text ? `<div class="ds-hero__buttons">${renderButton({ text: buttonArgs.text, href: buttonArgs.href ?? '', variant: 'light' })}</div>` : '';

  const photo = image && !subpage ? `<img class="ds-hero__photo" src="${escapeHtml(image)}" alt="${escapeHtml(imageAlt)}" fetchpriority="high">` : '';
  const art = illustration && subpage ? `<div class="ds-hero__illustration"><img src="${escapeHtml(illustration)}" alt=""></div>` : '';
  const content = `<div class="ds-hero__content">${titleMarkup}${leadMarkup}${subtitleMarkup}${buttonMarkup}</div>`;
  const box = `<div class="ds-hero__box">${photo}<div class="ds-hero__inner">${content}${art}</div></div>`;
  const tileMarkup = tileList.length
    ? `<ul class="ds-hero__tiles" role="list">${tileList.map((tile) => `<li class="ds-hero__tile">${renderCardHeroTile({ headingTag: 'h2', ...tile })}</li>`).join('')}</ul>`
    : '';
  const crumbs = subpage && breadcrumbs.length ? `<div class="ds-hero__crumbs">${renderBreadcrumbs({ items: breadcrumbs })}</div>` : '';

  const classes = ['ds-hero', `ds-hero--${variantName}`, subpage ? 'ds-hero--subpage' : '', photo ? 'has-photo' : ''].filter(Boolean).join(' ');
  return `<section class="${classes}">${box}${tileMarkup}${crumbs}</section>`;
}
