<?php
// PHP twin of breadcrumbs.template.js: a trail of links, the last item is the current page.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';

defined('DS_BREADCRUMBS_DEFAULT_TRAIL') || define('DS_BREADCRUMBS_DEFAULT_TRAIL', [
    ['text' => 'Strona główna', 'href' => '/'],
    ['text' => 'Szkolenia', 'href' => '/szkolenia/'],
    ['text' => 'Negocjacje handlowe'],
]);

if (!function_exists('ds_render_breadcrumbs')) {
    function ds_render_breadcrumbs(array $args = []): string
    {
        ['items' => $items, 'ariaLabel' => $ariaLabel] = $args + ['items' => DS_BREADCRUMBS_DEFAULT_TRAIL, 'ariaLabel' => 'Ścieżka nawigacji'];
        $items = array_values($items);
        $list = '';
        foreach ($items as $index => $item) {
            $content = $index === count($items) - 1
                ? '<span class="ds-breadcrumbs__current" aria-current="page">' . ds_escape_html($item['text'] ?? null) . '</span>'
                : '<a class="ds-breadcrumbs__link" href="' . ds_escape_html($item['href'] ?? '#') . '">' . ds_escape_html($item['text'] ?? null) . '</a>';
            $list .= '<li class="ds-breadcrumbs__item">' . $content . '</li>';
        }
        return '<nav class="ds-breadcrumbs" aria-label="' . ds_escape_html($ariaLabel) . '"><ol class="ds-breadcrumbs__list">' . $list . '</ol></nav>';
    }
}
