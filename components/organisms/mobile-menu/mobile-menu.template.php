<?php
// PHP twin of mobile-menu.template.js: the phone drawer (rows, the Oferta row as <details>, footer buttons).
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../../atoms/button/button.template.php';
require_once __DIR__ . '/../../molecules/accordion/accordion.template.php';

defined('DS_MOBILE_MENU_AREAS') || define('DS_MOBILE_MENU_AREAS', ['Rozwój top managementu i firmy', 'Rozwój liderów', 'Rozwój zespołów', 'Rozwój kluczowych specjalistów', 'Rozwój sprzedawców i BOK', 'Badania diagnostyczne']);

defined('DS_MOBILE_MENU_DEFAULT_ITEMS') || define('DS_MOBILE_MENU_DEFAULT_ITEMS', [
    [
        'text' => 'Oferta',
        'href' => '#',
        'offer' => [
            'links' => array_map(static fn (string $text): array => ['text' => $text, 'href' => '#'], DS_MOBILE_MENU_AREAS),
            'allText' => 'Zobacz całą ofertę',
            'allHref' => '#',
        ],
    ],
    ['text' => 'O nas', 'href' => '#'],
    ['text' => 'Nasze standardy', 'href' => '#'],
    ['text' => 'Metody i narzędzia', 'href' => '#'],
    ['text' => 'Sklep', 'href' => '#'],
    ['text' => 'Blog', 'href' => '#'],
]);

defined('DS_MOBILE_MENU_DEFAULT_BUTTONS') || define('DS_MOBILE_MENU_DEFAULT_BUTTONS', [
    ['text' => 'Dzwonię', 'href' => 'tel:+48000000000'],
    ['text' => 'Piszę maila', 'href' => 'mailto:kontakt@example.com'],
]);

if (!function_exists('ds_mobile_menu_offer')) {
    function ds_mobile_menu_offer(array $item): string
    {
        $offer = $item['offer'];
        $links = '';
        foreach ($offer['links'] as $link) {
            $links .= '<li><a class="ds-mobile-menu__sublink" href="' . ds_escape_html($link['href'] ?? null) . '">' . ds_escape_html($link['text'] ?? null) . '</a></li>';
        }
        if (ds_truthy($offer['allHref'] ?? null)) {
            $allText = $offer['allText'] ?? null;
            $links .= '<li><a class="ds-mobile-menu__all" href="' . ds_escape_html($offer['allHref']) . '">' . ds_escape_html(ds_truthy($allText) ? $allText : 'Zobacz wszystkie') . '<span aria-hidden="true"> →</span></a></li>';
        }
        return '<details class="ds-details ds-mobile-menu__offer">' . ds_render_accordion_summary(ds_pick($item, ['text']) + ['className' => 'ds-mobile-menu__row']) . '<ul class="ds-mobile-menu__sublist" role="list">' . $links . '</ul></details>';
    }
}

if (!function_exists('ds_render_mobile_menu')) {
    function ds_render_mobile_menu(array $args = []): string
    {
        ['id' => $id, 'items' => $items, 'buttons' => $buttons, 'ariaLabel' => $ariaLabel, 'open' => $open] = $args + [
            'id' => 'ds-mobile-menu', 'items' => DS_MOBILE_MENU_DEFAULT_ITEMS, 'buttons' => DS_MOBILE_MENU_DEFAULT_BUTTONS, 'ariaLabel' => 'Menu', 'open' => false,
        ];
        $rows = '';
        foreach ($items as $item) {
            if (ds_truthy($item['offer'] ?? null)) {
                $rows .= '<li>' . ds_mobile_menu_offer($item) . '</li>';
                continue;
            }
            $rows .= '<li><a class="ds-mobile-menu__row ds-mobile-menu__link" href="' . ds_escape_html($item['href'] ?? null) . '"' . (ds_truthy($item['current'] ?? null) ? ' aria-current="page"' : '') . '>' . ds_escape_html($item['text'] ?? null) . '</a></li>';
        }
        $footer = '';
        if (count($buttons) > 0) {
            $footer = '<div class="ds-mobile-menu__footer">';
            foreach (array_values($buttons) as $index => $button) {
                $footer .= ds_render_button(ds_pick($button, ['text', 'href']) + ['variant' => $index === 0 ? 'accent' : 'primary']);
            }
            $footer .= '</div>';
        }
        return '<div class="ds-mobile-menu" id="' . ds_escape_html($id) . '" data-ds-mobile-menu' . (ds_truthy($open) ? '' : ' hidden') . '><nav class="ds-mobile-menu__nav" aria-label="' . ds_escape_html($ariaLabel) . '"><ul class="ds-mobile-menu__list" role="list">' . $rows . '</ul></nav>' . $footer . '</div>';
    }
}
