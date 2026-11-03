<?php
// PHP twin of check-item.template.js: a ticked list item and the list of them.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';

defined('DS_CHECK_TONES') || define('DS_CHECK_TONES', ['default', 'on-brand']);

defined('DS_CHECK_ITEM_TICK') || define(
    'DS_CHECK_ITEM_TICK',
    '<svg class="ds-check-item__icon" viewBox="0 0 27 27" fill="none" stroke="currentColor" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 13.5 11.36 21 21 6"/></svg>'
);

if (!function_exists('ds_render_check_item')) {
    function ds_render_check_item(array $args = []): string
    {
        ['text' => $text] = $args + ['text' => 'szef czuje się przeciążony i zagubiony w operacyjnym chaosie'];
        return '<li class="ds-check-item">' . DS_CHECK_ITEM_TICK . '<span class="ds-check-item__text">' . ds_escape_html($text) . '</span></li>';
    }
}

if (!function_exists('ds_render_check_list')) {
    function ds_render_check_list(array $args = []): string
    {
        ['items' => $items, 'tone' => $tone] = $args + [
            'items' => ['szef czuje się przeciążony i zagubiony w operacyjnym chaosie', 'zespół nie wie, jakie ma priorytety'],
            'tone' => 'default',
        ];
        $toneClass = $tone === 'on-brand' ? ' ds-check-list--on-brand' : '';
        $rows = '';
        foreach ($items as $text) {
            $rows .= ds_render_check_item(['text' => $text]);
        }
        return '<ul class="ds-check-list' . $toneClass . '" role="list">' . $rows . '</ul>';
    }
}
