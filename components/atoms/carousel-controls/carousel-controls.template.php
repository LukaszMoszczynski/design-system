<?php
// PHP twin of carousel-controls.template.js: prev/next arrows, pagination dots and the „3 / 16” counter.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../icon/icon.template.php';

defined('DS_CAROUSEL_ARROW_LABELS') || define('DS_CAROUSEL_ARROW_LABELS', ['prev' => 'Poprzednie', 'next' => 'Następne']);

if (!function_exists('ds_render_carousel_arrow')) {
    function ds_render_carousel_arrow(array $args = []): string
    {
        ['direction' => $direction, 'ariaLabel' => $ariaLabel, 'disabled' => $disabled] = $args + ['direction' => 'next', 'ariaLabel' => '', 'disabled' => false];
        $directionName = $direction === 'prev' ? 'prev' : 'next';
        $icon = ds_render_icon(['name' => $directionName === 'prev' ? 'chevron-left' : 'chevron-right']);
        $name = ds_escape_html(ds_truthy($ariaLabel) ? $ariaLabel : DS_CAROUSEL_ARROW_LABELS[$directionName]);
        return '<button type="button" class="ds-carousel-arrow ds-carousel-arrow--' . $directionName . '" data-ds-carousel-' . $directionName . ' aria-label="' . $name . '"' . (ds_truthy($disabled) ? ' disabled' : '') . '>' . $icon . '</button>';
    }
}

if (!function_exists('ds_render_carousel_dot')) {
    function ds_render_carousel_dot(array $args = []): string
    {
        ['index' => $index, 'active' => $active] = $args + ['index' => 0, 'active' => false];
        $current = ds_truthy($active) ? ' aria-current="true"' : '';
        return '<button type="button" class="ds-carousel-dot" data-ds-dot="' . ds_string($index) . '" aria-label="Przejdź do slajdu ' . ds_string($index + 1) . '"' . $current . '></button>';
    }
}

if (!function_exists('ds_render_carousel_counter')) {
    function ds_render_carousel_counter(array $args = []): string
    {
        ['active' => $active, 'count' => $count] = $args + ['active' => 0, 'count' => 1];
        return '<span class="ds-carousel-controls__counter">' . ds_string($active + 1) . ' / ' . ds_string($count) . '</span>';
    }
}

if (!function_exists('ds_render_carousel_controls')) {
    // The nav row: prev, dots (or the counter when the dots do not fit), next.
    function ds_render_carousel_controls(array $args = []): string
    {
        ['count' => $count, 'active' => $active, 'counter' => $counter, 'prevDisabled' => $prevDisabled, 'nextDisabled' => $nextDisabled] = $args + [
            'count' => 4, 'active' => 0, 'counter' => false, 'prevDisabled' => false, 'nextDisabled' => false,
        ];
        if (ds_truthy($counter)) {
            $dots = ds_render_carousel_counter(['active' => $active, 'count' => $count]);
        } else {
            $dots = '';
            for ($index = 0; $index < (int) $count; $index += 1) {
                $dots .= ds_render_carousel_dot(['index' => $index, 'active' => $index === $active]);
            }
        }
        return '<div class="ds-carousel-controls">' . ds_render_carousel_arrow(['direction' => 'prev', 'disabled' => $prevDisabled]) . '<div class="ds-carousel-controls__dots" data-ds-carousel-dots' . (ds_truthy($counter) ? ' aria-live="polite"' : '') . '>' . $dots . '</div>' . ds_render_carousel_arrow(['direction' => 'next', 'disabled' => $nextDisabled]) . '</div>';
    }
}
