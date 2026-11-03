<?php
// PHP twin of label.template.js: the small bold pill. Variant accent, primary, inverse.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';

defined('DS_LABEL_VARIANTS') || define('DS_LABEL_VARIANTS', ['accent', 'primary', 'inverse']);

if (!function_exists('ds_render_label')) {
    function ds_render_label(array $args = []): string
    {
        ['text' => $text, 'variant' => $variant] = $args + ['text' => 'Polecane', 'variant' => 'accent'];
        $variantName = in_array($variant, DS_LABEL_VARIANTS, true) ? $variant : 'accent';
        return '<span class="ds-label ds-label--' . $variantName . '">' . ds_escape_html($text) . '</span>';
    }
}
