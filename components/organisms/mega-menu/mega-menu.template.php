<?php
// PHP twin of mega-menu.template.js: the Oferta panel (bestsellers, offer areas with links, shop row).
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../../atoms/button/button.template.php';
require_once __DIR__ . '/../../atoms/icon/icon.template.php';

defined('DS_MEGA_MENU_DEFAULT_BESTSELLERS') || define('DS_MEGA_MENU_DEFAULT_BESTSELLERS', [
    ['title' => 'Akademia Kompetencji Menedżerskich', 'text' => 'Program rozwoju kompetencji przywódczych i zarządzania', 'href' => '#'],
    ['title' => 'Gramy do jednej bramki', 'text' => 'Warsztaty wzmacniające relacje i osiąganie wyników', 'href' => '#'],
    ['title' => 'Samotny bohater?', 'text' => 'Executive coaching z elementami mentoringu', 'href' => '#'],
]);

defined('DS_MEGA_MENU_DEFAULT_AREAS') || define('DS_MEGA_MENU_DEFAULT_AREAS', array_map(
    static fn (array $area): array => array_merge($area, ['links' => array_map(static fn (string $text): array => ['text' => $text, 'href' => '#'], $area['links'])]),
    [
        ['name' => 'Rozwój top managementu i firmy', 'links' => ['Zdrowa Organizacja: konsultacje dla szefów', 'Coaching dla zarządu i kadry kierowniczej'], 'href' => '#'],
        ['name' => 'Rozwój liderów', 'links' => ['Plecak menedżerski START', 'Stop mobbingowi i dyskryminacji'], 'href' => '#'],
        ['name' => 'Rozwój zespołów', 'links' => ['Od talentów do mocnych stron', 'Team coaching'], 'href' => '#'],
        ['name' => 'Rozwój kluczowych specjalistów', 'links' => ['Sztuka coachingu dla HR', 'Dobre praktyki trenera wewnętrznego'], 'href' => '#'],
        ['name' => 'Rozwój sprzedawców i BOK', 'links' => ['Fokus na klienta', 'Level Up – sprzedaż na wyższym poziomie'], 'href' => '#'],
        ['name' => 'Badania diagnostyczne', 'links' => ['PCM® dla menedżerów i liderów', 'Od talentów do mocnych stron. Program rozwojowy oparty na Gallup CliftonStrengths®'], 'href' => '#'],
    ]
));

defined('DS_MEGA_MENU_DEFAULT_SHOP') || define('DS_MEGA_MENU_DEFAULT_SHOP', [
    'title' => 'Szkolenia otwarte i konsultacje', 'text' => 'Kupisz od ręki — z ceną i terminem, bez rozmowy handlowej', 'buttonText' => 'Do sklepu', 'href' => '#',
]);

if (!function_exists('ds_render_mega_menu')) {
    function ds_render_mega_menu(array $args = []): string
    {
        ['id' => $id, 'text' => $text, 'bestsellers' => $bestsellers, 'areas' => $areas, 'allText' => $allText, 'shop' => $shop, 'open' => $open] = $args + [
            'id' => 'ds-mega-menu',
            'text' => 'Szczególnie polecamy',
            'bestsellers' => DS_MEGA_MENU_DEFAULT_BESTSELLERS,
            'areas' => DS_MEGA_MENU_DEFAULT_AREAS,
            'allText' => 'Zobacz wszystkie',
            'shop' => DS_MEGA_MENU_DEFAULT_SHOP,
            'open' => false,
        ];
        $bestsellerItems = '';
        foreach ($bestsellers as $item) {
            $itemText = $item['text'] ?? null;
            $bestsellerItems .= '<li><a class="ds-mega-menu__bestseller" href="' . ds_escape_html($item['href'] ?? null) . '"><span class="ds-mega-menu__bestseller-title">' . ds_escape_html($item['title'] ?? null) . '</span>'
                . (ds_truthy($itemText) ? '<span class="ds-mega-menu__bestseller-text">' . ds_escape_html($itemText) . '</span>' : '') . '</a></li>';
        }
        $top = count($bestsellers) > 0
            ? '<div class="ds-mega-menu__bestsellers"><p class="ds-mega-menu__label">' . ds_escape_html($text) . '</p><ul class="ds-mega-menu__bestseller-list" role="list">' . $bestsellerItems . '</ul></div>'
            : '';
        $areaItems = '';
        foreach ($areas as $area) {
            $links = '';
            foreach ($area['links'] as $link) {
                $links .= '<li><a class="ds-mega-menu__link" href="' . ds_escape_html($link['href'] ?? null) . '">' . ds_escape_html($link['text'] ?? null) . '</a></li>';
            }
            $areaHref = $area['href'] ?? null;
            $all = ds_truthy($areaHref) ? '<a class="ds-mega-menu__all" href="' . ds_escape_html($areaHref) . '"><span>' . ds_escape_html($allText) . '</span>' . ds_render_icon(['name' => 'chevron-right']) . '</a>' : '';
            $areaItems .= '<li class="ds-mega-menu__area"><p class="ds-mega-menu__area-name">' . ds_escape_html($area['name'] ?? null) . '</p><ul class="ds-mega-menu__links" role="list">' . $links . '</ul>' . $all . '</li>';
        }
        $middle = count($areas) > 0 ? '<ul class="ds-mega-menu__areas" role="list">' . $areaItems . '</ul>' : '';
        $bottom = ds_truthy($shop)
            ? '<div class="ds-mega-menu__shop"><div class="ds-mega-menu__shop-text"><p class="ds-mega-menu__shop-title">' . ds_escape_html($shop['title'] ?? null) . '</p><p class="ds-mega-menu__shop-desc">' . ds_escape_html($shop['text'] ?? null) . '</p></div>'
                . ds_render_button((array_key_exists('buttonText', $shop) ? ['text' => $shop['buttonText']] : []) + ds_pick($shop, ['href']) + ['variant' => 'light', 'shape' => 'pill']) . '</div>'
            : '';
        return '<div class="ds-mega-menu" id="' . ds_escape_html($id) . '" data-ds-mega' . (ds_truthy($open) ? '' : ' hidden') . '>' . $top . $middle . $bottom . '</div>';
    }
}
