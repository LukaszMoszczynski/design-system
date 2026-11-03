<?php
// PHP twin of accordion-challenge.template.js: a challenge row (<details>) with its answer and link, and the list.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../accordion/accordion.template.php';
require_once __DIR__ . '/../../atoms/link/link.template.php';
require_once __DIR__ . '/../../atoms/text/text.template.php';

defined('DS_ACCORDION_CHALLENGE_DEFAULTS') || define('DS_ACCORDION_CHALLENGE_DEFAULTS', [
    ['question' => 'Ludzie się po prostu nie dogadują', 'answer' => 'Komunikacja się rwie, decyzje grzęzną i nie wiadomo, kto właściwie za co odpowiada. Zamiast współpracy pojawiają się napięcia i ciche pretensje.', 'linkText' => 'Zobacz program', 'href' => '#'],
    ['question' => 'Szef jest przeciążony', 'answer' => 'Wszystko spływa na jedną osobę, a zespół czeka na decyzje. Brakuje delegowania i jasnych priorytetów.', 'linkText' => 'Zobacz program', 'href' => '#'],
    ['question' => 'Sprzedaż stoi w miejscu', 'answer' => 'Handlowcy mają wiedzę o produkcie, ale rozmowy kończą się rabatem albo odłożeniem decyzji.', 'linkText' => 'Zobacz program', 'href' => '#'],
]);

if (!function_exists('ds_render_accordion_challenge')) {
    function ds_render_accordion_challenge(array $args = []): string
    {
        $first = DS_ACCORDION_CHALLENGE_DEFAULTS[0];
        ['question' => $question, 'answer' => $answer, 'linkText' => $linkText, 'href' => $href, 'name' => $name, 'open' => $open] = $args + [
            'question' => $first['question'], 'answer' => $first['answer'], 'linkText' => $first['linkText'], 'href' => $first['href'],
            'name' => '', 'open' => false,
        ];
        $link = ds_truthy($href) ? ds_render_link(['text' => $linkText, 'href' => $href, 'variant' => 'inverse']) : '';
        $answerText = ds_truthy($answer) ? ds_render_text(['text' => $answer, 'variant' => 'body', 'className' => 'ds-accordion-challenge__text']) : '';
        $nameAttribute = ds_truthy($name) ? ' name="' . ds_escape_html($name) . '"' : '';
        return '<details class="ds-details ds-accordion-challenge"' . $nameAttribute . (ds_truthy($open) ? ' open' : '') . '>'
            . ds_render_accordion_summary(['text' => $question, 'className' => 'ds-accordion-challenge__summary'])
            . '<div class="ds-accordion-challenge__body">' . $answerText . $link . '</div></details>';
    }
}

if (!function_exists('ds_render_accordion_challenge_list')) {
    function ds_render_accordion_challenge_list(array $args = []): string
    {
        ['items' => $items, 'name' => $name] = $args + ['items' => DS_ACCORDION_CHALLENGE_DEFAULTS, 'name' => 'wyzwania'];
        $rows = '';
        foreach ($items as $item) {
            $rows .= ds_render_accordion_challenge(array_merge($item, ['name' => $name]));
        }
        return '<div class="ds-accordion-challenge-list">' . $rows . '</div>';
    }
}
