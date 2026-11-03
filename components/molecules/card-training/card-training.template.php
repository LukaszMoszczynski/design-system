<?php
// PHP twin of card-training.template.js: the training card (carousel, column, featured, row as <details>).
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/heading-tags.php';
require_once __DIR__ . '/../../atoms/button/button.template.php';
require_once __DIR__ . '/../../atoms/text/text.template.php';
require_once __DIR__ . '/../accordion/accordion.template.php';
require_once __DIR__ . '/../benefits/benefits.template.php';
require_once __DIR__ . '/../check-item/check-item.template.php';

defined('DS_CARD_TRAINING_VARIANTS') || define('DS_CARD_TRAINING_VARIANTS', ['carousel', 'column', 'featured', 'row']);

if (!function_exists('ds_render_card_training')) {
    function ds_render_card_training(array $args = []): string
    {
        [
            'variant' => $variant, 'overline' => $overline, 'name' => $name, 'text' => $text, 'time' => $time, 'title' => $title,
            'reasons' => $reasons, 'benefitsTitle' => $benefitsTitle, 'benefits' => $benefits, 'buttonText' => $buttonText,
            'href' => $href, 'open' => $open, 'headingTag' => $headingTag,
        ] = $args + [
            'variant' => 'carousel',
            'overline' => 'Komunikacja i feedback',
            'name' => 'Trudne rozmowy w zespole',
            'text' => 'Jak mówić o błędach, oczekiwaniach i granicach tak, by relacja się nie posypała.',
            'time' => 'Rekomendowany czas: 1 dzień',
            'title' => 'Szczególnie polecamy, gdy:',
            'reasons' => ['awansujesz specjalistów na liderów', 'zespół rośnie szybciej niż procesy', 'chcesz jednego standardu zarządzania'],
            'benefitsTitle' => 'Komunikacja i feedback',
            'benefits' => ['Pewność w pierwszych rozmowach 1:1', 'Delegowanie bez mikrozarządzania', 'Feedback, który nie rani'],
            'buttonText' => 'Zapytaj o termin',
            'href' => '#kontakt',
            'open' => false,
            'headingTag' => 'h3',
        ];
        $variantName = in_array($variant, DS_CARD_TRAINING_VARIANTS, true) ? $variant : 'carousel';
        $tag = in_array($headingTag, DS_CARD_HEADING_TAGS, true) ? $headingTag : 'h3';
        $overlineMarkup = ds_truthy($overline) ? ds_render_text(['text' => $overline, 'variant' => 'lg', 'className' => 'ds-card-training__overline']) : '';
        $nameMarkup = ds_render_text(['text' => $name, 'variant' => '2xl', 'tag' => $tag, 'className' => 'ds-card-training__name']);
        $textMarkup = ds_truthy($text) ? ds_render_text(['text' => $text, 'variant' => 'body', 'className' => 'ds-card-training__text']) : '';
        $timeMarkup = ds_truthy($time) ? ds_render_text(['text' => $time, 'variant' => 'body-bold', 'className' => 'ds-card-training__time']) : '';
        $button = ds_truthy($buttonText) && ds_truthy($href) ? '<div class="ds-card-training__actions">' . ds_render_button(['text' => $buttonText, 'href' => $href]) . '</div>' : '';
        $classes = 'ds-card-training ds-card-training--' . $variantName;

        if ($variantName === 'row') {
            return '<details class="ds-details ' . $classes . '"' . (ds_truthy($open) ? ' open' : '') . '>'
                . ds_render_accordion_summary(['text' => $name, 'className' => 'ds-card-training__summary'])
                . '<div class="ds-card-training__body">' . $textMarkup . $timeMarkup . $button . '</div></details>';
        }
        if ($variantName === 'featured') {
            $reasonList = count($reasons) > 0 ? '<div class="ds-card-training__reasons">' . ds_render_check_list(['items' => $reasons]) . '</div>' : '';
            $benefitsBlock = ds_truthy($benefitsTitle) || count($benefits) > 0 ? ds_render_benefits(['title' => $benefitsTitle, 'items' => $benefits]) : '';
            return '<article class="' . $classes . '"><div class="ds-card-training__tab">' . ds_render_text(['text' => $title, 'variant' => 'xl', 'tag' => $tag, 'className' => 'ds-card-training__title']) . '</div>' . $reasonList . $benefitsBlock . $timeMarkup . '</article>';
        }
        return '<article class="' . $classes . '">' . $overlineMarkup . $nameMarkup . $textMarkup . ($variantName === 'column' ? $button : $timeMarkup) . '</article>';
    }
}
