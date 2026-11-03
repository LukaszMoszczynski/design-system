<?php
// PHP twin of card-hero-tile.template.js: the hero's link tile (title, hashtag, text, bold link, round arrow).
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../../_shared/heading-tags.php';
require_once __DIR__ . '/../../atoms/button/button.template.php';
require_once __DIR__ . '/../../atoms/link/link.template.php';
require_once __DIR__ . '/../../atoms/tag/tag.template.php';
require_once __DIR__ . '/../../atoms/text/text.template.php';

if (!function_exists('ds_render_card_hero_tile')) {
    function ds_render_card_hero_tile(array $args = []): string
    {
        ['title' => $title, 'hashtag' => $hashtag, 'text' => $text, 'linkText' => $linkText, 'href' => $href, 'headingTag' => $headingTag] = $args + [
            'title' => 'Oferta szkoleń wewnętrznych',
            'hashtag' => '',
            'text' => 'Poznaj nasze programy dla liderów, zespołów, specjalistów i zarządów – znajdź rozwiązanie dla swojej organizacji.',
            'linkText' => 'Czytaj najnowsze artykuły',
            'href' => '#',
            'headingTag' => 'h3',
        ];
        $tag = in_array($headingTag, DS_CARD_HEADING_TAGS, true) ? $headingTag : 'h3';
        $body = implode('', [
            ds_render_text(['text' => $title, 'variant' => 'xl', 'tag' => $tag, 'className' => 'ds-card-hero-tile__title']),
            ds_truthy($hashtag) ? ds_render_tag(['text' => $hashtag, 'variant' => 'hashtag']) : '',
            ds_truthy($text) ? ds_render_text(['text' => $text, 'variant' => 'body', 'className' => 'ds-card-hero-tile__text']) : '',
            ds_truthy($linkText) ? ds_render_link(['text' => $linkText, 'href' => '', 'variant' => 'bold']) : '',
            ds_truthy($href) ? ds_render_button_arrow() : '',
        ]);
        if (ds_truthy($href)) {
            return '<a class="ds-card-hero-tile" href="' . ds_escape_html($href) . '">' . $body . '</a>';
        }
        return '<article class="ds-card-hero-tile">' . $body . '</article>';
    }
}
