<?php
// PHP twin of badge-circular.template.js: the round badge with its text on a circle and an arrow or tick in the dot.
// Without `id` the text path gets ds-badge-path-<n>, counted per request as the JS module counts per page.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../../atoms/icon/icon.template.php';

defined('DS_BADGE_CIRCULAR_ICONS') || define('DS_BADGE_CIRCULAR_ICONS', ['arrow', 'check']);
defined('DS_BADGE_CIRCULAR_VARIANTS') || define('DS_BADGE_CIRCULAR_VARIANTS', ['default', 'accent']);

defined('DS_BADGE_CIRCULAR_CHECK') || define(
    'DS_BADGE_CIRCULAR_CHECK',
    '<svg class="ds-icon ds-badge-circular__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12.5 10 17.5 19 7"/></svg>'
);

if (!function_exists('ds_render_badge_circular')) {
    function ds_render_badge_circular(array $args = []): string
    {
        static $badgeCount = 0;
        ['text' => $text, 'icon' => $icon, 'variant' => $variant, 'id' => $id, 'className' => $className] = $args + [
            'text' => 'Wyzwanie? Znajdziemy rozwiązanie', 'icon' => 'arrow', 'variant' => 'default', 'id' => '', 'className' => '',
        ];
        $badgeCount += 1;
        $pathId = ds_escape_html(ds_truthy($id) ? $id : 'ds-badge-path-' . $badgeCount);
        $wording = ds_escape_html($text);
        $variantClass = $variant === 'accent' ? 'ds-badge-circular--accent' : '';
        $classes = implode(' ', array_map('ds_escape_html', array_values(array_filter(['ds-badge-circular', $variantClass, $className], 'ds_truthy'))));
        $ring = '<svg class="ds-badge-circular__ring" viewBox="-80 -80 160 160" aria-hidden="true" focusable="false"><circle class="ds-badge-circular__disc" r="80"/><path id="' . $pathId . '" d="M0,-58 a58,58 0 1,1 -0.1,0" fill="none"/><text class="ds-badge-circular__text"><textPath href="#' . $pathId . '" textLength="358" lengthAdjust="spacing">' . $wording . '</textPath></text></svg>';
        $glyph = $icon === 'check' ? DS_BADGE_CIRCULAR_CHECK : ds_render_icon(['name' => 'arrow-diagonal']);
        return '<span class="' . $classes . '" role="img" aria-label="' . $wording . '">' . $ring . '<span class="ds-badge-circular__dot">' . $glyph . '</span></span>';
    }
}
