<?php
// PHP twin of form-field.template.js: the field (text, email, tel, select, textarea, search), the consent checkbox,
// the newsletter field and the quantity stepper.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../icon/icon.template.php';

defined('DS_FIELD_TYPES') || define('DS_FIELD_TYPES', ['text', 'email', 'tel', 'select', 'textarea', 'search']);

defined('DS_FIELD_SEARCH_ICON') || define(
    'DS_FIELD_SEARCH_ICON',
    '<svg class="ds-field__search-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><path d="M15 8.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"/><path d="m13.5 13.5 5 5" stroke-linecap="round"/></svg>'
);

defined('DS_CHECKBOX_TICK') || define(
    'DS_CHECKBOX_TICK',
    '<svg class="ds-checkbox__tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3.5 8.5 6.7 11.7 12.5 5.2"/></svg>'
);

if (!function_exists('ds_render_form_field')) {
    // One field: a box with the control and its floating label, plus the error message below when `error` is set.
    // select: `options` [{ value, text }]; search: no <label>, `ariaLabel` (default: the placeholder) names it.
    function ds_render_form_field(array $args = []): string
    {
        [
            'type' => $type, 'label' => $label, 'placeholder' => $placeholder, 'ariaLabel' => $ariaLabel, 'name' => $name,
            'id' => $id, 'value' => $value, 'options' => $options, 'error' => $error, 'required' => $required,
        ] = $args + [
            'type' => 'text', 'label' => 'Adres e-mail', 'placeholder' => 'Szukaj', 'ariaLabel' => '', 'name' => 'email',
            'id' => '', 'value' => '', 'options' => [], 'error' => '', 'required' => false,
        ];
        $typeName = in_array($type, DS_FIELD_TYPES, true) ? $type : 'text';
        $fieldId = ds_escape_html(ds_truthy($id) ? $id : 'ds-field-' . ds_string($name));
        $messageId = $fieldId . '-message';
        $common = 'class="ds-field__control" id="' . $fieldId . '" name="' . ds_escape_html($name) . '"'
            . (ds_truthy($required) ? ' required' : '')
            . (ds_truthy($error) ? ' aria-invalid="true" aria-describedby="' . $messageId . '"' : '');
        $kind = in_array($typeName, ['select', 'textarea', 'search'], true) ? $typeName : 'text';

        if ($typeName === 'search') {
            return '<div class="ds-field ds-field--search"><div class="ds-field__box">' . DS_FIELD_SEARCH_ICON . '<input type="search" ' . $common . ' value="' . ds_escape_html($value) . '" placeholder="' . ds_escape_html($placeholder) . '" aria-label="' . ds_escape_html(ds_truthy($ariaLabel) ? $ariaLabel : $placeholder) . '"></div></div>';
        }

        if ($typeName === 'select') {
            $items = '';
            foreach (array_merge([['value' => '', 'text' => '']], array_values($options)) as $option) {
                $optionValue = $option['value'] ?? null;
                $selected = ds_string($optionValue) === ds_string($value) ? ' selected' : '';
                $items .= '<option value="' . ds_escape_html($optionValue) . '"' . $selected . '>' . ds_escape_html($option['text'] ?? null) . '</option>';
            }
            $control = '<select ' . $common . '>' . $items . '</select>';
        } elseif ($typeName === 'textarea') {
            $control = '<textarea ' . $common . ' placeholder=" ">' . ds_escape_html($value) . '</textarea>';
        } else {
            $control = '<input type="' . $typeName . '" ' . $common . ' value="' . ds_escape_html($value) . '" placeholder=" ">';
        }
        $chevron = $typeName === 'select' ? '<span class="ds-field__chevron">' . ds_render_icon(['name' => 'chevron-right']) . '</span>' : '';
        $message = ds_truthy($error) ? '<p class="ds-field__message" id="' . $messageId . '">' . ds_escape_html($error) . '</p>' : '';
        return '<div class="ds-field ds-field--' . $kind . '"><div class="ds-field__box">' . $control . '<label class="ds-field__label" for="' . $fieldId . '">' . ds_escape_html($label) . '</label>' . $chevron . '</div>' . $message . '</div>';
    }
}

if (!function_exists('ds_render_checkbox')) {
    // Consent checkbox: a native input drawn as a 20 px box, the tick as inline SVG in currentColor.
    function ds_render_checkbox(array $args = []): string
    {
        ['label' => $label, 'name' => $name, 'id' => $id, 'checked' => $checked, 'required' => $required] = $args + [
            'label' => 'Akceptuję regulamin i politykę prywatności', 'name' => 'terms', 'id' => '', 'checked' => false, 'required' => false,
        ];
        $fieldId = ds_escape_html(ds_truthy($id) ? $id : 'ds-checkbox-' . ds_string($name));
        return '<div class="ds-checkbox"><span class="ds-checkbox__box"><input type="checkbox" class="ds-checkbox__input" id="' . $fieldId . '" name="' . ds_escape_html($name) . '"' . (ds_truthy($checked) ? ' checked' : '') . (ds_truthy($required) ? ' required' : '') . '>' . DS_CHECKBOX_TICK . '</span><label class="ds-checkbox__label" for="' . $fieldId . '">' . ds_escape_html($label) . '</label></div>';
    }
}

if (!function_exists('ds_render_newsletter_field')) {
    // Footer newsletter: a pill e-mail input and a round submit with an arrow. Place it inside the organism's <form>.
    function ds_render_newsletter_field(array $args = []): string
    {
        ['placeholder' => $placeholder, 'name' => $name, 'ariaLabel' => $ariaLabel, 'submitAriaLabel' => $submitAriaLabel] = $args + [
            'placeholder' => 'Wpisz swój e-mail', 'name' => 'email', 'ariaLabel' => 'Adres e-mail do newslettera', 'submitAriaLabel' => 'Zapisz się',
        ];
        return '<div class="ds-newsletter-field"><input type="email" class="ds-newsletter-field__input" name="' . ds_escape_html($name) . '" placeholder="' . ds_escape_html($placeholder) . '" aria-label="' . ds_escape_html($ariaLabel) . '" autocomplete="email" required><button type="submit" class="ds-newsletter-field__submit" aria-label="' . ds_escape_html($submitAriaLabel) . '">' . ds_render_icon(['name' => 'chevron-right']) . '</button></div>';
    }
}

if (!function_exists('ds_render_quantity_stepper')) {
    // Quantity stepper: minus, the typed quantity, plus (the buy box wires the buttons).
    function ds_render_quantity_stepper(array $args = []): string
    {
        ['value' => $value, 'min' => $min, 'max' => $max, 'name' => $name, 'ariaLabel' => $ariaLabel] = $args + [
            'value' => 1, 'min' => 1, 'max' => 99, 'name' => 'quantity', 'ariaLabel' => 'Liczba',
        ];
        return '<div class="ds-quantity" data-ds-quantity><button type="button" class="ds-quantity__button" data-ds-quantity-minus aria-label="Mniej">−</button><input type="number" class="ds-quantity__input" name="' . ds_escape_html($name) . '" value="' . ds_escape_html($value) . '" min="' . ds_escape_html($min) . '" max="' . ds_escape_html($max) . '" inputmode="numeric" aria-label="' . ds_escape_html($ariaLabel) . '"><button type="button" class="ds-quantity__button" data-ds-quantity-plus aria-label="Więcej">+</button></div>';
    }
}
