<?php
// PHP twin of card-partner.template.js: a partner card (logo, subtitle, title, text), grid or carousel look.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../../_shared/heading-tags.php';
require_once __DIR__ . '/../../atoms/text/text.template.php';

defined('DS_CARD_PARTNER_VARIANTS') || define('DS_CARD_PARTNER_VARIANTS', ['grid', 'carousel']);

if (!function_exists('ds_render_card_partner')) {
    function ds_render_card_partner(array $args = []): string
    {
        [
            'title' => $title, 'subtitle' => $subtitle, 'text' => $text, 'logo' => $logo, 'logoAlt' => $logoAlt,
            'variant' => $variant, 'headingTag' => $headingTag,
        ] = $args + [
            'title' => 'Północna Izba Gospodarcza (PIG)',
            'subtitle' => 'Aktywni przedsiębiorcy w regionie',
            'text' => 'Jesteśmy członkami największej izby gospodarczej w Polsce, której siedziba znajduje się w Szczecinie. Uczestniczymy w życiu lokalnego biznesu.',
            'logo' => './placeholders/wide.svg',
            'logoAlt' => 'Logo Północnej Izby Gospodarczej',
            'variant' => 'grid',
            'headingTag' => 'h3',
        ];
        $variantName = in_array($variant, DS_CARD_PARTNER_VARIANTS, true) ? $variant : 'grid';
        $tag = in_array($headingTag, DS_CARD_HEADING_TAGS, true) ? $headingTag : 'h3';
        $parts = [
            ds_truthy($logo) ? '<img class="ds-card-partner__logo" src="' . ds_escape_html($logo) . '" alt="' . ds_escape_html($logoAlt) . '" loading="lazy">' : '',
            ds_truthy($subtitle) ? ds_render_text(['text' => $subtitle, 'variant' => 'body', 'className' => 'ds-card-partner__subtitle']) : '',
            ds_render_text(['text' => $title, 'variant' => $variantName === 'carousel' ? 'xl' : '2xl', 'tag' => $tag, 'className' => 'ds-card-partner__title']),
            ds_truthy($text) ? ds_render_text(['text' => $text, 'variant' => 'body', 'className' => 'ds-card-partner__text']) : '',
        ];
        return '<article class="ds-card-partner ds-card-partner--' . $variantName . '">' . implode('', $parts) . '</article>';
    }
}
