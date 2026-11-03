<?php
// PHP twin of buy-box.template.js: the shop buy box (price with brutto/netto switch, term select, quantity, facts,
// submit). buy-box.js keeps the price, note and total in step.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../../atoms/button/button.template.php';
require_once __DIR__ . '/../../atoms/form-field/form-field.template.php';

defined('DS_BUY_BOX_DEFAULT_TERMS') || define('DS_BUY_BOX_DEFAULT_TERMS', [
    ['value' => '2026-03-12', 'text' => '12–13 marca 2026 · Szczecin'],
    ['value' => '2026-04-16', 'text' => '16–17 kwietnia 2026 · Warszawa'],
    ['value' => '2026-05-21', 'text' => '21–22 maja 2026 · online'],
]);

defined('DS_BUY_BOX_DEFAULT_FACTS') || define('DS_BUY_BOX_DEFAULT_FACTS', [
    ['label' => 'Kiedy', 'value' => '12–13 marca 2026'],
    ['label' => 'Godziny', 'value' => '9:00–16:00'],
    ['label' => 'Czas trwania', 'value' => '2 dni (16 h)'],
    ['label' => 'Gdzie', 'value' => 'Szczecin, ul. 5 Lipca 30/4'],
]);

if (!function_exists('ds_buy_box_format_price')) {
    // formatPrice(): 1490 → "1 490 zł", 1211.38 → "1 211,38 zł" (non-breaking spaces), as buy-box.js formats it.
    function ds_buy_box_format_price(mixed $amount): string
    {
        $nbsp = "\u{00A0}";
        $value = floor(ds_number($amount) * 100 + 0.5) / 100; // Math.round(amount * 100) / 100
        $isInteger = is_finite($value) && floor($value) === $value;
        [$whole, $cents] = array_pad(explode('.', number_format($value, $isInteger ? 0 : 2, '.', '')), 2, '');
        $grouped = (string) preg_replace('/\B(?=(\d{3})+(?!\d))/', $nbsp, $whole);
        return $grouped . ($cents !== '' ? ',' . $cents : '') . $nbsp . 'zł';
    }
}

if (!function_exists('ds_render_buy_box')) {
    function ds_render_buy_box(array $args = []): string
    {
        [
            'gross' => $gross, 'net' => $net, 'terms' => $terms, 'term' => $term, 'termLabel' => $termLabel,
            'quantityLabel' => $quantityLabel, 'seats' => $seats, 'facts' => $facts, 'buttonText' => $buttonText,
            'priceModeAriaLabel' => $priceModeAriaLabel, 'action' => $action, 'id' => $id,
        ] = $args + [
            'gross' => 1490,
            'net' => 1211.38,
            'terms' => DS_BUY_BOX_DEFAULT_TERMS,
            'term' => DS_BUY_BOX_DEFAULT_TERMS[0]['value'],
            'termLabel' => 'Termin',
            'quantityLabel' => 'Liczba miejsc',
            'seats' => 20,
            'facts' => DS_BUY_BOX_DEFAULT_FACTS,
            'buttonText' => 'Dodaj do koszyka',
            'priceModeAriaLabel' => 'Pokaż cenę',
            'action' => '#',
            'id' => 'ds-buy-box',
        ];
        $quantityId = ds_string($id) . '-quantity-label';
        $price = '<div class="ds-buy-box__price">'
            . '<p class="ds-buy-box__amount" data-ds-buy-amount>' . ds_escape_html(ds_buy_box_format_price($gross)) . '</p>'
            . '<p class="ds-buy-box__note" data-ds-buy-note>brutto · ' . ds_escape_html(ds_buy_box_format_price($net)) . ' netto</p>'
            . '<div class="ds-buy-box__modes" role="group" aria-label="' . ds_escape_html($priceModeAriaLabel) . '">'
            . '<button type="button" class="ds-buy-box__mode" data-ds-price-mode="brutto" aria-pressed="true">brutto</button>'
            . '<button type="button" class="ds-buy-box__mode" data-ds-price-mode="netto" aria-pressed="false">netto</button>'
            . '</div></div>';
        $termField = count($terms) > 0
            ? ds_render_form_field(['type' => 'select', 'label' => $termLabel, 'name' => 'termin', 'id' => ds_string($id) . '-term', 'options' => $terms, 'value' => $term])
            : '';
        $quantity = '<div class="ds-buy-box__quantity" role="group" aria-labelledby="' . ds_escape_html($quantityId) . '"><p class="ds-buy-box__label" id="' . ds_escape_html($quantityId) . '">' . ds_escape_html($quantityLabel) . '</p><div class="ds-buy-box__row">'
            . ds_render_quantity_stepper(['value' => 1, 'min' => 1, 'max' => $seats, 'ariaLabel' => $quantityLabel])
            . '<p class="ds-buy-box__total" data-ds-buy-total aria-live="polite">Razem: ' . ds_escape_html(ds_buy_box_format_price($gross)) . '</p></div></div>';
        $factList = '';
        if (count($facts) > 0) {
            $factList = '<dl class="ds-buy-box__facts">';
            foreach ($facts as $fact) {
                $factList .= '<div class="ds-buy-box__fact"><dt class="ds-buy-box__fact-label"><span class="ds-buy-box__fact-icon" aria-hidden="true"></span>' . ds_escape_html($fact['label'] ?? null) . '</dt><dd class="ds-buy-box__fact-value">' . ds_escape_html($fact['value'] ?? null) . '</dd></div>';
            }
            $factList .= '</dl>';
        }
        $submit = ds_render_button(['text' => $buttonText, 'variant' => 'accent', 'type' => 'submit']);
        return '<form class="ds-buy-box" id="' . ds_escape_html($id) . '" action="' . ds_escape_html($action) . '" method="post" data-ds-buy-box data-ds-gross="' . ds_escape_html($gross) . '" data-ds-net="' . ds_escape_html($net) . '">' . $price . $termField . $quantity . $factList . $submit . '</form>';
    }
}
