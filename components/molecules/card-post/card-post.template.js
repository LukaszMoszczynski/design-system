// Card/Post: a blog post teaser, photo beside the text. Figma: Molecules → Card/Post (25:277). DCC: dcc_post_card()
// (inc/blog.php), .dcc-post-card--poziomy (assets/css/components/post-card.css). The whole card is one link (one focus
// ring). Composes Tag (white, the date as <time>), Text (title, excerpt) and Button arrow (decorative).
// arrow: accent (carousel, blog grid) or primary (under a post); hover and focus swap the two.
import { escapeHtml } from '../../_shared/escape.js';
import { renderButtonArrow } from '../../atoms/button/button.template.js';
import { renderTag } from '../../atoms/tag/tag.template.js';
import { renderText } from '../../atoms/text/text.template.js';
import { CARD_HEADING_TAGS } from '../card-program/card-program.template.js';

export const CARD_POST_ARROWS = ['accent', 'primary'];

export function renderCardPost({
  title = 'Jak stać się mentorem we własnej firmie?',
  excerpt = 'Jeśli zmieniłeś swoje wyobrażenia o inspirującym życiu szefa i większość rzeczy w firmie wykonujesz…',
  date = '26 kwietnia 2016',
  datetime = '2016-04-26',
  image = './placeholders/square.svg',
  href = '#',
  arrow = 'accent',
  headingTag = 'h3',
} = {}) {
  const arrowName = CARD_POST_ARROWS.includes(arrow) ? arrow : 'accent';
  const tag = CARD_HEADING_TAGS.includes(headingTag) ? headingTag : 'h3';
  const photo = image ? `<img class="ds-card-post__image" src="${escapeHtml(image)}" alt="" loading="lazy">` : '';
  const dateTag = date ? renderTag({ text: date, variant: 'white', datetime }) : '';
  const media = `<div class="ds-card-post__media">${photo}${dateTag}</div>`;
  const body = `<div class="ds-card-post__body">${renderText({ text: title, variant: '2xl', tag, className: 'ds-card-post__title' })}${excerpt ? renderText({ text: excerpt, variant: 'body', className: 'ds-card-post__excerpt' }) : ''}${renderButtonArrow()}</div>`;
  const classes = `ds-card-post ds-card-post--arrow-${arrowName}`;
  if (href) return `<a class="${classes}" href="${escapeHtml(href)}">${media}${body}</a>`;
  return `<article class="${classes}">${media}${body}</article>`;
}
