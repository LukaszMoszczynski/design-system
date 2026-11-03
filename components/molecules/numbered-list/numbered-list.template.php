<?php
// PHP twin of numbered-list.template.js: a numbered list with letter circles 1, 2, 3…
declare(strict_types=1);

require_once __DIR__ . '/../../atoms/number/number.template.php';
require_once __DIR__ . '/../../atoms/text/text.template.php';

defined('DS_NUMBERED_LIST_DEFAULT_ITEMS') || define('DS_NUMBERED_LIST_DEFAULT_ITEMS', ['Diagnoza potrzeb i celów', 'Program szyty na miarę', 'Warsztaty i wdrożenie', 'Mierzenie efektów']);

if (!function_exists('ds_render_numbered_list')) {
    function ds_render_numbered_list(array $args = []): string
    {
        ['items' => $items] = $args + ['items' => DS_NUMBERED_LIST_DEFAULT_ITEMS];
        $rows = '';
        foreach (array_values($items) as $index => $item) {
            $rows .= '<li class="ds-numbered-list__item">' . ds_render_letter_circle(['text' => (string) ($index + 1)]) . ds_render_text(['text' => $item, 'variant' => '2xl-medium', 'tag' => 'span', 'className' => 'ds-numbered-list__text']) . '</li>';
        }
        return '<ol class="ds-numbered-list" role="list">' . $rows . '</ol>';
    }
}
