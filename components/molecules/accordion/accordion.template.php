<?php
// PHP twin of accordion.template.js: the summary row, one item (<details>) and the accordion (one or two columns).
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../../atoms/icon/icon.template.php';
require_once __DIR__ . '/../../atoms/text/text.template.php';

defined('DS_ACCORDION_VARIANTS') || define('DS_ACCORDION_VARIANTS', ['one-column', 'two-columns']);

defined('DS_ACCORDION_DEFAULT_FAQ') || define('DS_ACCORDION_DEFAULT_FAQ', [
    ['question' => 'Jak wygląda pierwsze spotkanie z trenerem?', 'answer' => 'Zaczynamy od krótkiej rozmowy o celach i sytuacji zespołu. Na tej podstawie trener dobiera ćwiczenia i przykłady z Waszej branży.'],
    ['question' => 'Czy szkolenie może odbyć się w naszej siedzibie?', 'answer' => 'Tak. Przyjeżdżamy do Waszego biura w całej Polsce albo prowadzimy warsztat w wynajętej sali.'],
    ['question' => 'Ile osób może wziąć udział w warsztacie?', 'answer' => 'Najlepiej pracuje się w grupie od 8 do 14 osób, tak by każdy miał czas na ćwiczenia.'],
    ['question' => 'Czy po szkoleniu otrzymamy materiały?', 'answer' => 'Każdy uczestnik dostaje skrypt z ćwiczeniami i listę narzędzi do dalszej pracy.'],
    ['question' => 'Jak długo trwa jeden moduł?', 'answer' => 'Moduł to zwykle jeden dzień warsztatów, czyli 7 godzin z przerwami.'],
    ['question' => 'Czy wystawiacie certyfikaty uczestnictwa?', 'answer' => 'Tak, każdy uczestnik otrzymuje imienny certyfikat po zakończeniu programu.'],
]);

if (!function_exists('ds_render_accordion_summary')) {
    function ds_render_accordion_summary(array $args = []): string
    {
        ['text' => $text, 'className' => $className] = $args + ['text' => DS_ACCORDION_DEFAULT_FAQ[0]['question'], 'className' => ''];
        $classes = implode(' ', array_map('ds_escape_html', array_values(array_filter(['ds-accordion-summary', $className], 'ds_truthy'))));
        $icons = ds_render_icon(['name' => 'plus', 'className' => 'ds-accordion-summary__plus']) . ds_render_icon(['name' => 'minus', 'className' => 'ds-accordion-summary__minus']);
        return '<summary class="' . $classes . '"><span class="ds-accordion-summary__text">' . ds_escape_html($text) . '</span><span class="ds-accordion-summary__icon" aria-hidden="true">' . $icons . '</span></summary>';
    }
}

if (!function_exists('ds_render_accordion_item')) {
    function ds_render_accordion_item(array $args = []): string
    {
        ['question' => $question, 'answer' => $answer, 'open' => $open] = $args + [
            'question' => DS_ACCORDION_DEFAULT_FAQ[0]['question'], 'answer' => DS_ACCORDION_DEFAULT_FAQ[0]['answer'], 'open' => false,
        ];
        return '<details class="ds-details ds-accordion__item"' . (ds_truthy($open) ? ' open' : '') . '>'
            . ds_render_accordion_summary(['text' => $question, 'className' => 'ds-accordion__summary'])
            . '<div class="ds-accordion__answer">' . ds_render_text(['text' => $answer, 'variant' => 'body']) . '</div></details>';
    }
}

if (!function_exists('ds_render_accordion')) {
    function ds_render_accordion(array $args = []): string
    {
        ['items' => $items, 'variant' => $variant, 'single' => $single] = $args + ['items' => DS_ACCORDION_DEFAULT_FAQ, 'variant' => 'one-column', 'single' => false];
        $variantName = in_array($variant, DS_ACCORDION_VARIANTS, true) ? $variant : 'one-column';
        $rendered = array_map('ds_render_accordion_item', array_values($items));
        $half = (int) ceil(count($rendered) / 2);
        $columns = $variantName === 'two-columns' ? [array_slice($rendered, 0, $half), array_slice($rendered, $half)] : [$rendered];
        $body = implode('', array_map(static fn (array $column): string => '<div class="ds-accordion__column">' . implode('', $column) . '</div>', $columns));
        return '<div class="ds-accordion ds-accordion--' . $variantName . '" data-ds-accordion' . (ds_truthy($single) ? ' data-ds-single' : '') . '>' . $body . '</div>';
    }
}
