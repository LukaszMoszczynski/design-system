<?php
// PHP twin of card-program.template.js: the program card (stepped title box, texts, outline pill and round arrow).
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../../_shared/heading-tags.php';
require_once __DIR__ . '/../../atoms/button/button.template.php';
require_once __DIR__ . '/../../atoms/text/text.template.php';

if (!function_exists('ds_render_card_program')) {
    function ds_render_card_program(array $args = []): string
    {
        ['title' => $title, 'subtitle' => $subtitle, 'text' => $text, 'moreText' => $moreText, 'href' => $href, 'headingTag' => $headingTag] = $args + [
            'title' => 'Negocjacje handlowe',
            'subtitle' => 'Szkolenie otwarte · 2 dni',
            'text' => 'Praktyczny warsztat dla handlowców i kupców: przygotowanie, prowadzenie i domykanie trudnych negocjacji.',
            'moreText' => 'Więcej',
            'href' => '#',
            'headingTag' => 'h3',
        ];
        $tag = in_array($headingTag, DS_CARD_HEADING_TAGS, true) ? $headingTag : 'h3';
        $body = '<div class="ds-card-program__title-box">' . ds_render_text(['text' => $title, 'variant' => '2xl', 'tag' => $tag, 'className' => 'ds-card-program__title']) . '</div>'
            . '<div class="ds-card-program__texts">'
            . (ds_truthy($subtitle) ? ds_render_text(['text' => $subtitle, 'variant' => 'body', 'className' => 'ds-card-program__subtitle']) : '')
            . (ds_truthy($text) ? ds_render_text(['text' => $text, 'variant' => 'body', 'className' => 'ds-card-program__text']) : '')
            . '</div>'
            . '<div class="ds-card-program__footer">' . ds_render_button_outline(['text' => $moreText]) . ds_render_button_arrow(['variant' => 'inverted']) . '</div>';
        if (ds_truthy($href)) {
            return '<a class="ds-card-program" href="' . ds_escape_html($href) . '">' . $body . '</a>';
        }
        return '<article class="ds-card-program">' . $body . '</article>';
    }
}
