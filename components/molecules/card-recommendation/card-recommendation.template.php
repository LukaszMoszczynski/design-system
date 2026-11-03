<?php
// PHP twin of card-recommendation.template.js: the "we recommend it when" card (tab title, badge, reasons, benefits).
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/heading-tags.php';
require_once __DIR__ . '/../../atoms/text/text.template.php';
require_once __DIR__ . '/../badge-circular/badge-circular.template.php';
require_once __DIR__ . '/../benefits/benefits.template.php';
require_once __DIR__ . '/../check-item/check-item.template.php';

defined('DS_CARD_RECOMMENDATION_VARIANTS') || define('DS_CARD_RECOMMENDATION_VARIANTS', ['default', 'blue']);

if (!function_exists('ds_render_card_recommendation')) {
    function ds_render_card_recommendation(array $args = []): string
    {
        [
            'title' => $title, 'badgeText' => $badgeText, 'reasons' => $reasons, 'benefitsTitle' => $benefitsTitle,
            'benefits' => $benefits, 'variant' => $variant, 'headingTag' => $headingTag,
        ] = $args + [
            'title' => 'Szczególnie polecamy, gdy:',
            'badgeText' => 'Ten program szczególnie polecamy',
            'reasons' => [
                'szef czuje się przeciążony i zagubiony w operacyjnym chaosie',
                'top lider odpowiada w firmie „za wszystko”',
                'występują stany obniżenia poczucia równowagi, autonomii i poziomu energii',
            ],
            'benefitsTitle' => '3 główne korzyści',
            'benefits' => ['jasność co do swojej roli i autonomii', 'odzyskana równowaga i energia', 'przestrzeń do rozmowy i wsparcia'],
            'variant' => 'default',
            'headingTag' => 'h3',
        ];
        $variantName = in_array($variant, DS_CARD_RECOMMENDATION_VARIANTS, true) ? $variant : 'default';
        $onBrand = $variantName === 'blue';
        $tag = in_array($headingTag, DS_CARD_HEADING_TAGS, true) ? $headingTag : 'h3';
        $parts = [
            '<div class="ds-card-recommendation__tab">' . ds_render_text(['text' => $title, 'variant' => '2xl', 'tag' => $tag, 'className' => 'ds-card-recommendation__title']) . '</div>',
            ds_truthy($badgeText) ? ds_render_badge_circular(['text' => $badgeText, 'icon' => 'check', 'className' => 'ds-card-recommendation__badge']) : '',
            count($reasons) > 0 ? '<div class="ds-card-recommendation__reasons">' . ds_render_check_list(['items' => $reasons, 'tone' => $onBrand ? 'on-brand' : 'default']) . '</div>' : '',
            ds_truthy($benefitsTitle) || count($benefits) > 0
                ? ds_render_benefits(['title' => $benefitsTitle, 'items' => $benefits, 'chevron' => true, 'variant' => $onBrand ? 'on-brand' : 'default'])
                : '',
        ];
        return '<article class="ds-card-recommendation ds-card-recommendation--' . $variantName . '">' . implode('', $parts) . '</article>';
    }
}
