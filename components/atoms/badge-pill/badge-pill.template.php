<?php
// PHP twin of badge-pill.template.js: the shop pill, printed as Label markup (polecane = accent, promocja = inverse,
// akcja = primary).
declare(strict_types=1);

require_once __DIR__ . '/../label/label.template.php';

defined('DS_BADGE_PILL_VARIANTS') || define('DS_BADGE_PILL_VARIANTS', ['polecane' => 'accent', 'promocja' => 'inverse', 'akcja' => 'primary']);
defined('DS_BADGE_PILL_DEFAULT_TEXT') || define('DS_BADGE_PILL_DEFAULT_TEXT', ['polecane' => 'Polecane', 'promocja' => 'Promocja', 'akcja' => 'Akcja']);

if (!function_exists('ds_render_badge_pill')) {
    function ds_render_badge_pill(array $args = []): string
    {
        ['variant' => $variant, 'text' => $text] = $args + ['variant' => 'polecane', 'text' => ''];
        $variantName = is_string($variant) && isset(DS_BADGE_PILL_VARIANTS[$variant]) ? $variant : 'polecane';
        return ds_render_label([
            'text' => ds_truthy($text) ? $text : DS_BADGE_PILL_DEFAULT_TEXT[$variantName],
            'variant' => DS_BADGE_PILL_VARIANTS[$variantName],
        ]);
    }
}
