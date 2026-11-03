<?php
// PHP twin of icon.template.js: inline SVG icons in currentColor, decorative (aria-hidden).
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';

defined('DS_ICON_PATHS') || define('DS_ICON_PATHS', [
    'arrow-diagonal' => ['M7 17 17 7M17 15V7H9'],
    'chevron-left' => ['M20 12H4M10 18 4 12 10 6'],
    'chevron-right' => ['M4 12H20M14 18 20 12 14 6'],
    'plus' => ['M6 12H18', 'M12 6V18'],
    'minus' => ['M6 12H18'],
]);
defined('DS_ICON_NAMES') || define('DS_ICON_NAMES', array_keys(DS_ICON_PATHS));

// Round caps and joins for the arrows; the plus/minus bars are square-ended.
defined('DS_ICON_STROKES') || define('DS_ICON_STROKES', [
    'arrow-diagonal' => 'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"',
    'chevron-left' => 'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"',
    'chevron-right' => 'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"',
    'plus' => 'stroke-width="1.6"',
    'minus' => 'stroke-width="1.6"',
]);

if (!function_exists('ds_render_icon')) {
    function ds_render_icon(array $args = []): string
    {
        ['name' => $name, 'className' => $className] = $args + ['name' => 'arrow-diagonal', 'className' => ''];
        $iconName = is_string($name) && isset(DS_ICON_PATHS[$name]) ? $name : 'arrow-diagonal';
        $classes = ds_class_list(['ds-icon', 'ds-icon--' . $iconName, $className]);
        $pathMarkup = implode('', array_map(static fn (string $path): string => '<path d="' . $path . '"/>', DS_ICON_PATHS[$iconName]));
        return '<svg class="' . $classes . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' . DS_ICON_STROKES[$iconName] . ' aria-hidden="true" focusable="false">' . $pathMarkup . '</svg>';
    }
}
