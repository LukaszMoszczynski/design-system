<?php
// PHP twin of button.template.js: the main button (arrow or pill), the outline pill and the round arrow.
// With href the element is <a>, otherwise <button type="button">. Text args are escaped.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../icon/icon.template.php';

defined('DS_BUTTON_VARIANTS') || define('DS_BUTTON_VARIANTS', ['primary', 'accent', 'light']);
defined('DS_BUTTON_SHAPES') || define('DS_BUTTON_SHAPES', ['arrow', 'pill']);
defined('DS_BUTTON_ARROW_VARIANTS') || define('DS_BUTTON_ARROW_VARIANTS', ['default', 'inverted']);

if (!function_exists('ds_button_open_tag')) {
    // Disabled: a <button> gets the disabled attribute; a link loses its href and gets aria-disabled="true".
    // tag span: the look without a control. type submit: a <button type="submit">.
    function ds_button_open_tag(mixed $href, mixed $disabled, string $classes, mixed $tag, mixed $type): array
    {
        if ($tag === 'span') {
            return ['<span class="' . $classes . '">', '</span>'];
        }
        if (ds_truthy($href) && ds_truthy($disabled)) {
            return ['<a class="' . $classes . '" role="link" aria-disabled="true">', '</a>'];
        }
        if (ds_truthy($href)) {
            return ['<a class="' . $classes . '" href="' . ds_escape_html($href) . '">', '</a>'];
        }
        return ['<button type="' . ($type === 'submit' ? 'submit' : 'button') . '" class="' . $classes . '"' . (ds_truthy($disabled) ? ' disabled' : '') . '>', '</button>'];
    }
}

if (!function_exists('ds_render_button')) {
    // accentIcon: the accent circle at rest (a Light button on a blue surface); uppercase: the label in capitals.
    function ds_render_button(array $args = []): string
    {
        [
            'text' => $text, 'href' => $href, 'variant' => $variant, 'shape' => $shape, 'disabled' => $disabled,
            'tag' => $tag, 'type' => $type, 'accentIcon' => $accentIcon, 'uppercase' => $uppercase,
        ] = $args + [
            'text' => 'Poznaj ofertę', 'href' => '', 'variant' => 'primary', 'shape' => 'arrow', 'disabled' => false,
            'tag' => '', 'type' => 'button', 'accentIcon' => false, 'uppercase' => false,
        ];
        $variantName = in_array($variant, DS_BUTTON_VARIANTS, true) ? $variant : 'primary';
        $classes = ds_class_list([
            'ds-button',
            'ds-button--' . $variantName,
            $shape === 'pill' ? 'ds-button--pill' : '',
            ds_truthy($accentIcon) && $shape !== 'pill' ? 'ds-button--accent-icon' : '',
            ds_truthy($uppercase) ? 'ds-button--uppercase' : '',
        ]);
        [$open, $close] = ds_button_open_tag($href, $disabled, $classes, $tag, $type);
        $icon = $shape === 'pill' ? '' : '<span class="ds-button__icon">' . ds_render_icon(['name' => 'arrow-diagonal']) . '</span>';
        return $open . '<span class="ds-button__label">' . ds_escape_html($text) . '</span>' . $icon . $close;
    }
}

if (!function_exists('ds_render_button_outline')) {
    // The program card's "Więcej" pill. Without href a <span> (inside a card that is itself the link).
    function ds_render_button_outline(array $args = []): string
    {
        ['text' => $text, 'href' => $href] = $args + ['text' => 'Więcej', 'href' => ''];
        if (ds_truthy($href)) {
            return '<a class="ds-button-outline" href="' . ds_escape_html($href) . '">' . ds_escape_html($text) . '</a>';
        }
        return '<span class="ds-button-outline">' . ds_escape_html($text) . '</span>';
    }
}

if (!function_exists('ds_render_button_arrow')) {
    // The round accent arrow. Without href it is decorative; with href a link named by `ariaLabel`.
    function ds_render_button_arrow(array $args = []): string
    {
        ['href' => $href, 'ariaLabel' => $ariaLabel, 'variant' => $variant] = $args + ['href' => '', 'ariaLabel' => 'Czytaj dalej', 'variant' => 'default'];
        $classes = ds_class_list(['ds-button-arrow', $variant === 'inverted' ? 'ds-button-arrow--inverted' : '']);
        $icon = ds_render_icon(['name' => 'arrow-diagonal']);
        if (ds_truthy($href)) {
            return '<a class="' . $classes . '" href="' . ds_escape_html($href) . '" aria-label="' . ds_escape_html($ariaLabel) . '">' . $icon . '</a>';
        }
        return '<span class="' . $classes . '" aria-hidden="true">' . $icon . '</span>';
    }
}
