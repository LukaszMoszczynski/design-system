<?php
// PHP twin of social-row.template.js: the Social button list with the four default networks.
declare(strict_types=1);

require_once __DIR__ . '/../../atoms/social-button/social-button.template.php';

defined('DS_SOCIAL_ROW_VARIANTS') || define('DS_SOCIAL_ROW_VARIANTS', ['plain', 'raised']);
defined('DS_SOCIAL_ROW_DEFAULT_ITEMS') || define('DS_SOCIAL_ROW_DEFAULT_ITEMS', array_map(
    static fn (string $network): array => ['network' => $network, 'href' => '#'],
    ['linkedin', 'facebook', 'instagram', 'youtube']
));

if (!function_exists('ds_render_social_row')) {
    function ds_render_social_row(array $args = []): string
    {
        ['items' => $items, 'variant' => $variant] = $args + ['items' => DS_SOCIAL_ROW_DEFAULT_ITEMS, 'variant' => 'plain'];
        return ds_render_social_list(['items' => $items, 'variant' => in_array($variant, DS_SOCIAL_ROW_VARIANTS, true) ? $variant : 'plain']);
    }
}
