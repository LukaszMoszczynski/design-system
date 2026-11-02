// Card/Product: a shop product. Figma: Molecules → Card/Product (102:116, Variant Standard / Compact / Rows).
// DCC: blocks/sklep-lista (.dcc-sklep-karta). The whole card is one link (one focus ring): the Zobacz button (Standard,
// Rows) and the Zobacz text link (Compact) are decorative spans. Composes Badge pill, Text, Button (pill, span) and
// Link (brand, span).
import { escapeHtml } from '../../_shared/escape.js';
import { renderBadgePill } from '../../atoms/badge-pill/badge-pill.template.js';
import { renderButton } from '../../atoms/button/button.template.js';
import { renderLink } from '../../atoms/link/link.template.js';
import { renderText } from '../../atoms/text/text.template.js';
import { CARD_HEADING_TAGS } from '../card-program/card-program.template.js';

export const CARD_PRODUCT_VARIANTS = ['standard', 'compact', 'rows'];

export function renderCardProduct({
  title = 'Negocjacje handlowe dla zespołów B2B',
  text = 'Dwa dni warsztatów z praktykiem: przygotowanie, prowadzenie i domykanie trudnych rozmów z kupcami.',
  meta = 'Termin: 12–13 marca 2026 · Szczecin',
  price = '1 490 zł',
  oldPrice = '1 990 zł',
  badge = 'polecane',
  image = './placeholders/landscape.svg',
  moreText = 'Zobacz',
  href = '#',
  variant = 'standard',
  headingTag = 'h3',
} = {}) {
  const variantName = CARD_PRODUCT_VARIANTS.includes(variant) ? variant : 'standard';
  const tag = CARD_HEADING_TAGS.includes(headingTag) ? headingTag : 'h3';
  const media = `<div class="ds-card-product__media">${image ? `<img class="ds-card-product__image" src="${escapeHtml(image)}" alt="" loading="lazy">` : ''}</div>`;
  const oldPriceMarkup = oldPrice && variantName === 'standard' ? ` <s class="ds-card-product__old-price">${escapeHtml(oldPrice)}</s>` : '';
  const priceMarkup = price ? `<p class="ds-card-product__price"><span class="ds-card-product__current-price">${escapeHtml(price)}</span>${oldPriceMarkup}</p>` : '';
  const more =
    variantName === 'compact'
      ? renderLink({ text: moreText, href: '', variant: 'brand' })
      : renderButton({ text: moreText, variant: 'primary', shape: 'pill', tag: 'span' });
  const foot = `<div class="ds-card-product__foot">${priceMarkup}${more}</div>`;
  const body = [
    badge ? renderBadgePill({ variant: badge }) : '',
    renderText({ text: title, variant: variantName === 'compact' ? 'lg' : 'xl', tag, className: 'ds-card-product__title' }),
    text ? renderText({ text, variant: 'body', className: 'ds-card-product__text' }) : '',
    meta ? renderText({ text: meta, variant: 'body', className: 'ds-card-product__meta' }) : '',
    variantName === 'rows' ? '' : foot,
  ].join('');
  const content = `${media}<div class="ds-card-product__body">${body}</div>${variantName === 'rows' ? foot : ''}`;
  const classes = `ds-card-product ds-card-product--${variantName}`;
  if (href) return `<a class="${classes}" href="${escapeHtml(href)}">${content}</a>`;
  return `<article class="${classes}">${content}</article>`;
}
