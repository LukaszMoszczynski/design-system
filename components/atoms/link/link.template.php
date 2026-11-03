<?php
// PHP twin of link.template.js: text links. Variants with an arrow: arrow, brand, bold, inverse.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../icon/icon.template.php';

defined('DS_LINK_VARIANTS') || define('DS_LINK_VARIANTS', ['inline', 'list', 'arrow', 'brand', 'footer', 'bold', 'inverse']);
defined('DS_LINK_WITH_ARROW') || define('DS_LINK_WITH_ARROW', ['arrow', 'brand', 'bold', 'inverse']);

if (!function_exists('ds_render_link')) {
    // uppercase: the text in capitals. Without href: a span with the same look (inside a card that is the link).
    function ds_render_link(array $args = []): string
    {
        ['text' => $text, 'href' => $href, 'variant' => $variant, 'uppercase' => $uppercase] = $args + [
            'text' => 'Zobacz szczegóły', 'href' => '#', 'variant' => 'inline', 'uppercase' => false,
        ];
        $variantName = in_array($variant, DS_LINK_VARIANTS, true) ? $variant : 'inline';
        $classes = 'ds-link ds-link--' . $variantName . (ds_truthy($uppercase) ? ' ds-link--uppercase' : '');
        $arrow = in_array($variantName, DS_LINK_WITH_ARROW, true) ? ds_render_icon(['name' => 'arrow-diagonal']) : '';
        $content = $arrow !== '' ? '<span class="ds-link__label">' . ds_escape_html($text) . '</span>' . $arrow : ds_escape_html($text);
        if (!ds_truthy($href)) {
            return '<span class="' . $classes . '">' . $content . '</span>';
        }
        return '<a class="' . $classes . '" href="' . ds_escape_html($href) . '">' . $content . '</a>';
    }
}
