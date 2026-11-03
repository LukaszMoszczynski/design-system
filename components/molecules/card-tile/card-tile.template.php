<?php
// PHP twin of card-tile.template.js: a tile card (stepped title box, subtitle, text), a link when href is set.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../../_shared/heading-tags.php';
require_once __DIR__ . '/../../atoms/text/text.template.php';

if (!function_exists('ds_render_card_tile')) {
    function ds_render_card_tile(array $args = []): string
    {
        ['title' => $title, 'subtitle' => $subtitle, 'text' => $text, 'href' => $href, 'headingTag' => $headingTag] = $args + [
            'title' => 'Akredytacja Insights Discovery',
            'subtitle' => 'Certyfikacja · 3 dni',
            'text' => 'Uprawnienia do pracy z profilem Insights Discovery w zespołach i w coachingu indywidualnym.',
            'href' => '#',
            'headingTag' => 'h3',
        ];
        $tag = in_array($headingTag, DS_CARD_HEADING_TAGS, true) ? $headingTag : 'h3';
        $body = '<div class="ds-card-tile__title-box">' . ds_render_text(['text' => $title, 'variant' => '2xl', 'tag' => $tag, 'className' => 'ds-card-tile__title']) . '</div>'
            . '<div class="ds-card-tile__texts">'
            . (ds_truthy($subtitle) ? ds_render_text(['text' => $subtitle, 'variant' => 'body', 'className' => 'ds-card-tile__subtitle']) : '')
            . (ds_truthy($text) ? ds_render_text(['text' => $text, 'variant' => 'body', 'className' => 'ds-card-tile__text']) : '')
            . '</div>';
        if (ds_truthy($href)) {
            return '<a class="ds-card-tile" href="' . ds_escape_html($href) . '">' . $body . '</a>';
        }
        return '<article class="ds-card-tile">' . $body . '</article>';
    }
}
