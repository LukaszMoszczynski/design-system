<?php
// PHP twin of card-product.template.js: a shop product card (standard, compact, rows).
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../../_shared/heading-tags.php';
require_once __DIR__ . '/../../atoms/badge-pill/badge-pill.template.php';
require_once __DIR__ . '/../../atoms/button/button.template.php';
require_once __DIR__ . '/../../atoms/link/link.template.php';
require_once __DIR__ . '/../../atoms/text/text.template.php';

defined('DS_CARD_PRODUCT_VARIANTS') || define('DS_CARD_PRODUCT_VARIANTS', ['standard', 'compact', 'rows']);

if (!function_exists('ds_render_card_product')) {
    function ds_render_card_product(array $args = []): string
    {
        [
            'title' => $title, 'text' => $text, 'meta' => $meta, 'price' => $price, 'oldPrice' => $oldPrice, 'badge' => $badge,
            'image' => $image, 'moreText' => $moreText, 'href' => $href, 'variant' => $variant, 'headingTag' => $headingTag,
        ] = $args + [
            'title' => 'Negocjacje handlowe dla zespołów B2B',
            'text' => 'Dwa dni warsztatów z praktykiem: przygotowanie, prowadzenie i domykanie trudnych rozmów z kupcami.',
            'meta' => 'Termin: 12–13 marca 2026 · Szczecin',
            'price' => '1 490 zł',
            'oldPrice' => '1 990 zł',
            'badge' => 'polecane',
            'image' => './placeholders/landscape.svg',
            'moreText' => 'Zobacz',
            'href' => '#',
            'variant' => 'standard',
            'headingTag' => 'h3',
        ];
        $variantName = in_array($variant, DS_CARD_PRODUCT_VARIANTS, true) ? $variant : 'standard';
        $tag = in_array($headingTag, DS_CARD_HEADING_TAGS, true) ? $headingTag : 'h3';
        $media = '<div class="ds-card-product__media">' . (ds_truthy($image) ? '<img class="ds-card-product__image" src="' . ds_escape_html($image) . '" alt="" loading="lazy">' : '') . '</div>';
        $oldPriceMarkup = ds_truthy($oldPrice) && $variantName === 'standard' ? ' <s class="ds-card-product__old-price">' . ds_escape_html($oldPrice) . '</s>' : '';
        $priceMarkup = ds_truthy($price) ? '<p class="ds-card-product__price"><span class="ds-card-product__current-price">' . ds_escape_html($price) . '</span>' . $oldPriceMarkup . '</p>' : '';
        $more = $variantName === 'compact'
            ? ds_render_link(['text' => $moreText, 'href' => '', 'variant' => 'brand'])
            : ds_render_button(['text' => $moreText, 'variant' => 'primary', 'shape' => 'pill', 'tag' => 'span']);
        $foot = '<div class="ds-card-product__foot">' . $priceMarkup . $more . '</div>';
        $body = implode('', [
            ds_truthy($badge) ? ds_render_badge_pill(['variant' => $badge]) : '',
            ds_render_text(['text' => $title, 'variant' => $variantName === 'compact' ? 'lg' : 'xl', 'tag' => $tag, 'className' => 'ds-card-product__title']),
            ds_truthy($text) ? ds_render_text(['text' => $text, 'variant' => 'body', 'className' => 'ds-card-product__text']) : '',
            ds_truthy($meta) ? ds_render_text(['text' => $meta, 'variant' => 'body', 'className' => 'ds-card-product__meta']) : '',
            $variantName === 'rows' ? '' : $foot,
        ]);
        $content = $media . '<div class="ds-card-product__body">' . $body . '</div>' . ($variantName === 'rows' ? $foot : '');
        $classes = 'ds-card-product ds-card-product--' . $variantName;
        if (ds_truthy($href)) {
            return '<a class="' . $classes . '" href="' . ds_escape_html($href) . '">' . $content . '</a>';
        }
        return '<article class="' . $classes . '">' . $content . '</article>';
    }
}
