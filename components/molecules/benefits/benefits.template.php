<?php
// PHP twin of benefits.template.js: a pill title and a list of outline tags.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../../atoms/icon/icon.template.php';
require_once __DIR__ . '/../../atoms/tag/tag.template.php';

defined('DS_BENEFITS_VARIANTS') || define('DS_BENEFITS_VARIANTS', ['default', 'on-brand']);

if (!function_exists('ds_render_benefits')) {
    function ds_render_benefits(array $args = []): string
    {
        ['title' => $title, 'items' => $items, 'chevron' => $chevron, 'variant' => $variant] = $args + [
            'title' => '3 główne korzyści',
            'items' => ['jasność co do swojej roli i autonomii', 'odzyskana równowaga i energia', 'przestrzeń do rozmowy i wsparcia'],
            'chevron' => false,
            'variant' => 'default',
        ];
        $variantName = in_array($variant, DS_BENEFITS_VARIANTS, true) ? $variant : 'default';
        $titleMarkup = ds_truthy($title)
            ? '<p class="ds-benefits__title">' . ds_escape_html($title) . (ds_truthy($chevron) ? ds_render_icon(['name' => 'chevron-right']) : '') . '</p>'
            : '';
        $list = count($items) > 0
            ? '<ul class="ds-benefits__list" role="list">' . implode('', array_map(static fn (mixed $text): string => ds_render_tag(['text' => $text, 'variant' => 'outline', 'tag' => 'li']), array_values($items))) . '</ul>'
            : '';
        return '<div class="ds-benefits ds-benefits--' . $variantName . '">' . $titleMarkup . $list . '</div>';
    }
}
