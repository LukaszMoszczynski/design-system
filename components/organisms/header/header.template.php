<?php
// PHP twin of header.template.js: the site header (brand, main nav with the Oferta mega menu, CTA, burger, phone menu).
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../../atoms/icon/icon.template.php';
require_once __DIR__ . '/../../atoms/nav-link/nav-link.template.php';
require_once __DIR__ . '/../mega-menu/mega-menu.template.php';
require_once __DIR__ . '/../mobile-menu/mobile-menu.template.php';

defined('DS_HEADER_TAGS') || define('DS_HEADER_TAGS', ['header', 'div']);

defined('DS_HEADER_DEFAULT_ITEMS') || define('DS_HEADER_DEFAULT_ITEMS', [
    ['text' => 'Oferta', 'href' => '#', 'mega' => true],
    ['text' => 'Szkolenia', 'href' => '#', 'current' => true],
    ['text' => 'Metody', 'href' => '#'],
    ['text' => 'O nas', 'href' => '#'],
    ['text' => 'Blog', 'href' => '#'],
    ['text' => 'Kontakt', 'href' => '#'],
]);

if (!function_exists('ds_header_brand')) {
    function ds_header_brand(mixed $logo, mixed $logoAlt, mixed $homeHref, mixed $homeAriaLabel, mixed $badge, mixed $badgeAlt): string
    {
        $logoMark = ds_truthy($logo)
            ? '<img class="ds-header__logo-image" src="' . ds_escape_html($logo) . '" alt="' . ds_escape_html($logoAlt) . '">'
            : '<span class="ds-header__logo-placeholder" aria-hidden="true"></span>';
        $badgeMark = ds_truthy($badge)
            ? '<img class="ds-header__badge" src="' . ds_escape_html($badge) . '" alt="' . ds_escape_html($badgeAlt) . '">'
            : '<span class="ds-header__badge ds-header__badge--placeholder" aria-hidden="true"></span>';
        return '<div class="ds-header__brand"><a class="ds-header__logo" href="' . ds_escape_html($homeHref) . '" rel="home" aria-label="' . ds_escape_html($homeAriaLabel) . '">' . $logoMark . '</a>' . $badgeMark . '</div>';
    }
}

if (!function_exists('ds_render_header')) {
    function ds_render_header(array $args = []): string
    {
        [
            'items' => $items, 'ctaText' => $ctaText, 'ctaHref' => $ctaHref, 'logo' => $logo, 'logoAlt' => $logoAlt,
            'homeHref' => $homeHref, 'homeAriaLabel' => $homeAriaLabel, 'badge' => $badge, 'badgeAlt' => $badgeAlt,
            'navAriaLabel' => $navAriaLabel, 'megaToggleAriaLabel' => $megaToggleAriaLabel, 'burgerAriaLabel' => $burgerAriaLabel,
            'mega' => $mega, 'mobileMenu' => $mobileMenu, 'id' => $id, 'tag' => $tag, 'open' => $open, 'scrolled' => $scrolled,
        ] = $args + [
            'items' => DS_HEADER_DEFAULT_ITEMS,
            'ctaText' => 'Dzwonię',
            'ctaHref' => 'tel:+48000000000',
            'logo' => '',
            'logoAlt' => '',
            'homeHref' => '/',
            'homeAriaLabel' => 'DCC Grygorcewicz — strona główna',
            'badge' => '',
            'badgeAlt' => 'Pozytywnie Rozwojowi',
            'navAriaLabel' => 'Menu główne',
            'megaToggleAriaLabel' => 'Pokaż menu oferty',
            'burgerAriaLabel' => 'Menu',
            'mega' => [],
            'mobileMenu' => [],
            'id' => 'ds-header',
            'tag' => 'header',
            'open' => false,
            'scrolled' => false,
        ];
        $tagName = in_array($tag, DS_HEADER_TAGS, true) ? $tag : 'header';
        $megaId = ds_string($id) . '-mega';
        $menuId = ds_string($id) . '-menu';
        $items = array_values($items);
        // One panel: after the first mega item's toggle.
        $megaIndex = -1;
        foreach ($items as $index => $item) {
            if (ds_truthy($item['mega'] ?? null)) {
                $megaIndex = $index;
                break;
            }
        }
        $menu = '';
        foreach ($items as $index => $item) {
            $toggle = $index === $megaIndex
                ? '<button type="button" class="ds-header__toggle" aria-expanded="' . (ds_truthy($open) ? 'true' : 'false') . '" aria-controls="' . ds_escape_html($megaId) . '" aria-label="' . ds_escape_html($megaToggleAriaLabel) . '" data-ds-mega-toggle>' . ds_render_icon(['name' => 'chevron-right']) . '</button>'
                : '';
            $panel = $index === $megaIndex ? ds_render_mega_menu(array_merge($mega, ['id' => $megaId, 'open' => $open])) : '';
            $menu .= '<li class="ds-header__item">' . ds_render_nav_link(ds_pick($item, ['text', 'href', 'current'])) . $toggle . $panel . '</li>';
        }
        $bar = ds_header_brand($logo, $logoAlt, $homeHref, $homeAriaLabel, $badge, $badgeAlt)
            . '<nav class="ds-header__nav" aria-label="' . ds_escape_html($navAriaLabel) . '"><ul class="ds-header__menu" role="list">' . $menu . '</ul></nav>'
            . '<div class="ds-header__actions">' . ds_render_nav_cta(['text' => $ctaText, 'href' => $ctaHref]) . ds_render_nav_burger(['ariaLabel' => $burgerAriaLabel, 'controls' => $menuId]) . '</div>';
        $panels = ds_render_mobile_menu(array_merge($mobileMenu, ['id' => $menuId]));
        $classes = ds_truthy($scrolled) ? 'ds-header is-scrolled' : 'ds-header';
        return '<' . $tagName . ' class="' . $classes . '" data-ds-header><div class="ds-header__bar">' . $bar . '</div>' . $panels . '</' . $tagName . '>';
    }
}
