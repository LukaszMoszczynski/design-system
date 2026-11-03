<?php
// PHP twin of nav-link.template.js: the header nav link, the call-to-action pill and the phone menu toggle.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';

if (!function_exists('ds_render_nav_link')) {
    // Nav link: current = aria-current="page".
    function ds_render_nav_link(array $args = []): string
    {
        ['text' => $text, 'href' => $href, 'current' => $current] = $args + ['text' => 'Oferta', 'href' => '#', 'current' => false];
        return '<a class="ds-nav-link" href="' . ds_escape_html($href) . '"' . (ds_truthy($current) ? ' aria-current="page"' : '') . '>' . ds_escape_html($text) . '</a>';
    }
}

if (!function_exists('ds_render_nav_cta')) {
    // The header call-to-action pill (phone number link on the site).
    function ds_render_nav_cta(array $args = []): string
    {
        ['text' => $text, 'href' => $href] = $args + ['text' => 'Dzwonię', 'href' => 'tel:+48000000000'];
        return '<a class="ds-nav-cta" href="' . ds_escape_html($href) . '">' . ds_escape_html($text) . '</a>';
    }
}

if (!function_exists('ds_render_nav_burger')) {
    // The phone menu toggle. The header organism flips aria-expanded; open draws the ×.
    function ds_render_nav_burger(array $args = []): string
    {
        ['open' => $open, 'ariaLabel' => $ariaLabel, 'controls' => $controls] = $args + ['open' => false, 'ariaLabel' => 'Menu', 'controls' => ''];
        $controlsAttribute = ds_truthy($controls) ? ' aria-controls="' . ds_escape_html($controls) . '"' : '';
        return '<button type="button" class="ds-nav-burger" aria-expanded="' . (ds_truthy($open) ? 'true' : 'false') . '" aria-label="' . ds_escape_html($ariaLabel) . '"' . $controlsAttribute . '><span class="ds-nav-burger__lines"></span></button>';
    }
}
