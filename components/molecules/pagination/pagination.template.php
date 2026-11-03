<?php
// PHP twin of pagination.template.js: carousel dots or counter (Carousel controls), or numbered pages with a next link.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../../atoms/carousel-controls/carousel-controls.template.php';
require_once __DIR__ . '/../../atoms/icon/icon.template.php';
require_once __DIR__ . '/../../atoms/number/number.template.php';

defined('DS_PAGINATION_VARIANTS') || define('DS_PAGINATION_VARIANTS', ['dots', 'counter', 'pages']);

if (!function_exists('ds_pagination_page_href')) {
    // hrefPattern with the first {page} replaced by the page number (JS String.replace with a string).
    function ds_pagination_page_href(mixed $hrefPattern, int $page): string
    {
        $pattern = ds_string($hrefPattern);
        $position = strpos($pattern, '{page}');
        return $position === false ? $pattern : substr_replace($pattern, (string) $page, $position, strlen('{page}'));
    }
}

if (!function_exists('ds_render_pagination')) {
    function ds_render_pagination(array $args = []): string
    {
        [
            'variant' => $variant, 'count' => $count, 'active' => $active, 'current' => $current, 'hrefPattern' => $hrefPattern,
            'ariaLabel' => $ariaLabel, 'nextAriaLabel' => $nextAriaLabel,
        ] = $args + [
            'variant' => 'dots', 'count' => 5, 'active' => 1, 'current' => 1, 'hrefPattern' => '/blog/page/{page}/',
            'ariaLabel' => 'Stronicowanie', 'nextAriaLabel' => 'Następna strona',
        ];
        if ($variant !== 'pages') {
            return ds_render_carousel_controls(['count' => $count, 'active' => $active, 'counter' => $variant === 'counter']);
        }
        $items = [];
        for ($index = 0; $index < (int) $count; $index += 1) {
            $page = $index + 1;
            $items[] = '<li>' . ds_render_page_number(['text' => (string) $page, 'href' => ds_pagination_page_href($hrefPattern, $page), 'current' => $page === $current]) . '</li>';
        }
        if ($current < $count) {
            $items[] = '<li class="ds-pagination__next-item"><a class="ds-pagination__next" href="' . ds_escape_html(ds_pagination_page_href($hrefPattern, (int) $current + 1)) . '" aria-label="' . ds_escape_html($nextAriaLabel) . '">' . ds_render_icon(['name' => 'chevron-right']) . '</a></li>';
        }
        return '<nav class="ds-pagination ds-pagination--pages" aria-label="' . ds_escape_html($ariaLabel) . '"><ul class="ds-pagination__list" role="list">' . implode('', $items) . '</ul></nav>';
    }
}
