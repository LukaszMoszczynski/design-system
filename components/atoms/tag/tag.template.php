<?php
// PHP twin of tag.template.js: small pills. href → <a href>; datetime → <time datetime>; otherwise `tag` (span or li).
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';

defined('DS_TAG_VARIANTS') || define('DS_TAG_VARIANTS', ['soft', 'white', 'brand', 'outline', 'brand-small', 'article', 'article-white', 'hashtag']);

if (!function_exists('ds_render_tag')) {
    function ds_render_tag(array $args = []): string
    {
        ['text' => $text, 'variant' => $variant, 'href' => $href, 'datetime' => $datetime, 'tag' => $tag] = $args + [
            'text' => 'Przetestowany', 'variant' => 'soft', 'href' => '', 'datetime' => '', 'tag' => 'span',
        ];
        $classes = 'ds-tag ds-tag--' . (in_array($variant, DS_TAG_VARIANTS, true) ? $variant : 'soft');
        $content = ds_escape_html($text);
        if (ds_truthy($href)) {
            return '<a class="' . $classes . '" href="' . ds_escape_html($href) . '">' . $content . '</a>';
        }
        if (ds_truthy($datetime)) {
            return '<time class="' . $classes . '" datetime="' . ds_escape_html($datetime) . '">' . $content . '</time>';
        }
        $tagName = $tag === 'li' ? 'li' : 'span';
        return '<' . $tagName . ' class="' . $classes . '">' . $content . '</' . $tagName . '>';
    }
}
