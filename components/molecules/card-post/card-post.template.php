<?php
// PHP twin of card-post.template.js: a blog post card (image with date tag, title, excerpt, round arrow).
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../../_shared/heading-tags.php';
require_once __DIR__ . '/../../atoms/button/button.template.php';
require_once __DIR__ . '/../../atoms/tag/tag.template.php';
require_once __DIR__ . '/../../atoms/text/text.template.php';

defined('DS_CARD_POST_VARIANTS') || define('DS_CARD_POST_VARIANTS', ['accent', 'primary']);

if (!function_exists('ds_render_card_post')) {
    function ds_render_card_post(array $args = []): string
    {
        [
            'title' => $title, 'excerpt' => $excerpt, 'date' => $date, 'datetime' => $datetime, 'image' => $image,
            'href' => $href, 'variant' => $variant, 'headingTag' => $headingTag,
        ] = $args + [
            'title' => 'Jak stać się mentorem we własnej firmie?',
            'excerpt' => 'Jeśli zmieniłeś swoje wyobrażenia o inspirującym życiu szefa i większość rzeczy w firmie wykonujesz…',
            'date' => '26 kwietnia 2016',
            'datetime' => '2016-04-26',
            'image' => './placeholders/square.svg',
            'href' => '#',
            'variant' => 'accent',
            'headingTag' => 'h3',
        ];
        $variantName = in_array($variant, DS_CARD_POST_VARIANTS, true) ? $variant : 'accent';
        $tag = in_array($headingTag, DS_CARD_HEADING_TAGS, true) ? $headingTag : 'h3';
        $photo = ds_truthy($image) ? '<img class="ds-card-post__image" src="' . ds_escape_html($image) . '" alt="" loading="lazy">' : '';
        $dateTag = ds_truthy($date) ? ds_render_tag(['text' => $date, 'variant' => 'white', 'datetime' => $datetime]) : '';
        $media = '<div class="ds-card-post__media">' . $photo . $dateTag . '</div>';
        $body = '<div class="ds-card-post__body">' . ds_render_text(['text' => $title, 'variant' => '2xl', 'tag' => $tag, 'className' => 'ds-card-post__title'])
            . (ds_truthy($excerpt) ? ds_render_text(['text' => $excerpt, 'variant' => 'body', 'className' => 'ds-card-post__excerpt']) : '')
            . ds_render_button_arrow() . '</div>';
        $classes = 'ds-card-post ds-card-post--arrow-' . $variantName;
        if (ds_truthy($href)) {
            return '<a class="' . $classes . '" href="' . ds_escape_html($href) . '">' . $media . $body . '</a>';
        }
        return '<article class="' . $classes . '">' . $media . $body . '</article>';
    }
}
