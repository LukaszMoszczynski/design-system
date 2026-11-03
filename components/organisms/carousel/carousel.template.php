<?php
// PHP twin of carousel.template.js: the carousel section (heading group, Swiper track of any slide markup, controls).
// `slides` are HTML strings (already rendered cards); carousel.js wires `.ds-carousel[data-ds-carousel]`.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../../atoms/carousel-controls/carousel-controls.template.php';
require_once __DIR__ . '/../../molecules/heading-group/heading-group.template.php';

defined('DS_CAROUSEL_ITEMS') || define('DS_CAROUSEL_ITEMS', [2, 3, 4]);
defined('DS_CAROUSEL_NAVS') || define('DS_CAROUSEL_NAVS', ['below', 'beside-heading', 'above-right']);
defined('DS_CAROUSEL_PAGINATIONS') || define('DS_CAROUSEL_PAGINATIONS', ['dots', 'counter']);

defined('DS_CAROUSEL_DEFAULT_HEADING') || define('DS_CAROUSEL_DEFAULT_HEADING', [
    'overline' => 'Szkolenia otwarte',
    'title' => 'Programy, które wybierają zespoły sprzedaży',
    'lead' => 'Warsztaty prowadzone przez praktyków: krótkie bloki teorii, dużo ćwiczeń i',
    'leadStrong' => 'przykłady z Waszej branży.',
]);

if (!function_exists('ds_render_carousel')) {
    function ds_render_carousel(array $args = []): string
    {
        [
            'slides' => $slides, 'items' => $items, 'nav' => $nav, 'pagination' => $pagination, 'heading' => $heading,
            'ariaLabel' => $ariaLabel, 'id' => $id, 'centered' => $centered, 'mobileArrows' => $mobileArrows,
        ] = $args + [
            'slides' => [], 'items' => 3, 'nav' => 'below', 'pagination' => 'dots', 'heading' => DS_CAROUSEL_DEFAULT_HEADING,
            'ariaLabel' => '', 'id' => '', 'centered' => false, 'mobileArrows' => true,
        ];
        $itemCount = in_array(ds_number($items), DS_CAROUSEL_ITEMS) ? ds_number($items) : 3; // JS includes(Number(items))
        $navName = in_array($nav, DS_CAROUSEL_NAVS, true) ? $nav : 'below';
        $paginationName = in_array($pagination, DS_CAROUSEL_PAGINATIONS, true) ? $pagination : 'dots';
        $headingTitle = is_array($heading) ? ($heading['title'] ?? null) : null;
        $name = ds_truthy($ariaLabel) ? $ariaLabel : (ds_truthy($headingTitle) ? $headingTitle : 'Karuzela');
        $group = ds_truthy($heading) ? ds_render_heading_group(array_merge(['variant' => $navName === 'above-right' ? 'split' : 'stacked'], $heading)) : '';
        $controls = '<div class="ds-carousel__nav">' . ds_render_carousel_controls(['count' => count($slides), 'counter' => $paginationName === 'counter']) . '</div>';
        $head = $group !== '' || $navName === 'beside-heading' ? '<div class="ds-carousel__head">' . $group . ($navName === 'beside-heading' ? $controls : '') . '</div>' : '';
        $list = implode('', array_map(static fn (mixed $slide): string => '<li class="ds-carousel__slide">' . ds_string($slide) . '</li>', array_values($slides)));
        $trackId = ds_truthy($id) ? ' id="' . ds_escape_html($id) . '"' : '';
        $track = '<div class="ds-carousel__clip"><div class="ds-carousel__viewport"><ul class="ds-carousel__track" role="list"' . $trackId . '>' . $list . '</ul></div></div>';
        $attributes = 'data-ds-carousel data-ds-items="' . ds_string($itemCount) . '" data-ds-nav="' . $navName . '" data-ds-pagination="' . $paginationName . '" aria-roledescription="karuzela" aria-label="' . ds_escape_html($name) . '"'
            . (ds_truthy($centered) ? ' data-ds-centered' : '') . (ds_truthy($mobileArrows) ? '' : ' data-ds-mobile-arrows="off"');
        return '<section class="ds-carousel" ' . $attributes . '>' . $head . ($navName === 'above-right' ? $controls : '') . $track . ($navName === 'below' ? $controls : '') . '</section>';
    }
}
