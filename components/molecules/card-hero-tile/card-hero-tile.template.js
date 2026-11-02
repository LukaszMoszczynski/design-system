// Card/Hero tile: the tiles under the large hero. Figma: Molecules → Card/Hero tile (22:241). DCC: blocks/hero
// (.dcc-hero__tile). With href the whole tile is one link (one focus ring): the text link and the corner arrow are
// decorative spans. Composes Text (title, text), Tag (hashtag), Link (bold, as a span) and Button arrow.
import { escapeHtml } from '../../_shared/escape.js';
import { renderButtonArrow } from '../../atoms/button/button.template.js';
import { renderLink } from '../../atoms/link/link.template.js';
import { renderTag } from '../../atoms/tag/tag.template.js';
import { renderText } from '../../atoms/text/text.template.js';
import { CARD_HEADING_TAGS } from '../../_shared/heading-tags.js';

export function renderCardHeroTile({
  title = 'Oferta szkoleń wewnętrznych',
  hashtag = '',
  text = 'Poznaj nasze programy dla liderów, zespołów, specjalistów i zarządów – znajdź rozwiązanie dla swojej organizacji.',
  linkText = 'Czytaj najnowsze artykuły',
  href = '#',
  headingTag = 'h3',
} = {}) {
  const tag = CARD_HEADING_TAGS.includes(headingTag) ? headingTag : 'h3';
  const body = [
    renderText({ text: title, variant: 'xl', tag, className: 'ds-card-hero-tile__title' }),
    hashtag ? renderTag({ text: hashtag, variant: 'hashtag' }) : '',
    text ? renderText({ text, variant: 'body', className: 'ds-card-hero-tile__text' }) : '',
    linkText ? renderLink({ text: linkText, href: '', variant: 'bold' }) : '',
    href ? renderButtonArrow() : '',
  ].join('');
  if (href) return `<a class="ds-card-hero-tile" href="${escapeHtml(href)}">${body}</a>`;
  return `<article class="ds-card-hero-tile">${body}</article>`;
}
