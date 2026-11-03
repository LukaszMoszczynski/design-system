<?php
// PHP twin of card-industry-step.template.js: an industry card (title, challenge, action) beside its number circle.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../../_shared/heading-tags.php';
require_once __DIR__ . '/../../atoms/number/number.template.php';
require_once __DIR__ . '/../../atoms/text/text.template.php';

if (!function_exists('ds_card_industry_step_termed')) {
    // A paragraph with an optional bold lead-in term; nothing without text.
    function ds_card_industry_step_termed(mixed $term, mixed $text, string $className): string
    {
        if (!ds_truthy($text)) {
            return '';
        }
        return '<p class="' . $className . '">' . (ds_truthy($term) ? '<strong>' . ds_escape_html($term) . '</strong> ' : '') . ds_escape_html($text) . '</p>';
    }
}

if (!function_exists('ds_render_card_industry_step')) {
    function ds_render_card_industry_step(array $args = []): string
    {
        [
            'number' => $number, 'title' => $title, 'challengeTerm' => $challengeTerm, 'challenge' => $challenge,
            'actionTerm' => $actionTerm, 'action' => $action, 'active' => $active, 'headingTag' => $headingTag,
        ] = $args + [
            'number' => '01',
            'title' => 'Logistyka / magazyny / dystrybucja',
            'challengeTerm' => 'Wyzwanie:',
            'challenge' => 'napięcia między obszarami, brak spójnej współpracy przy dużej presji wyniku.',
            'actionTerm' => 'Działanie:',
            'action' => 'porządkujemy komunikację, role i odpowiedzialność, żeby zespół działał jako całość.',
            'active' => false,
            'headingTag' => 'h3',
        ];
        $tag = in_array($headingTag, DS_CARD_HEADING_TAGS, true) ? $headingTag : 'h3';
        $card = ds_render_text(['text' => $title, 'variant' => '2xl', 'tag' => $tag, 'className' => 'ds-card-industry-step__title'])
            . ds_card_industry_step_termed($challengeTerm, $challenge, 'ds-card-industry-step__challenge')
            . ds_card_industry_step_termed($actionTerm, $action, 'ds-card-industry-step__action');
        return '<article class="ds-card-industry-step' . (ds_truthy($active) ? ' is-active' : '') . '"><div class="ds-card-industry-step__card">' . $card . '</div><div class="ds-card-industry-step__number">' . ds_render_letter_circle(['text' => $number, 'variant' => 'industry', 'active' => $active]) . '</div></article>';
    }
}
