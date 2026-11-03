<?php
// PHP twin of number.template.js: the letter circle and the pagination page number.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';

defined('DS_LETTER_VARIANTS') || define('DS_LETTER_VARIANTS', ['step', 'word', 'industry']);

if (!function_exists('ds_render_letter_circle')) {
    // A letter or digit in a circle. Variant step, word or industry; active turns it accent.
    function ds_render_letter_circle(array $args = []): string
    {
        ['text' => $text, 'variant' => $variant, 'active' => $active] = $args + ['text' => 'E', 'variant' => 'step', 'active' => false];
        $variantName = in_array($variant, DS_LETTER_VARIANTS, true) ? $variant : 'step';
        $classes = ds_class_list(['ds-letter-circle', 'ds-letter-circle--' . $variantName, ds_truthy($active) ? 'is-active' : '']);
        return '<span class="' . $classes . '">' . ds_escape_html($text) . '</span>';
    }
}

if (!function_exists('ds_render_page_number')) {
    // A pagination number. The current page is a <span aria-current="page">, the others links.
    function ds_render_page_number(array $args = []): string
    {
        ['text' => $text, 'href' => $href, 'current' => $current] = $args + ['text' => '1', 'href' => '#', 'current' => false];
        if (ds_truthy($current)) {
            return '<span class="ds-page-number" aria-current="page">' . ds_escape_html($text) . '</span>';
        }
        return '<a class="ds-page-number" href="' . ds_escape_html($href) . '">' . ds_escape_html($text) . '</a>';
    }
}
