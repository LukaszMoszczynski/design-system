<?php
// PHP twin of text.template.js: text styles. `variant` is the type style, `tag` the HTML level, `tone` a text colour,
// `strong` an optional bold closing sentence, `className` extra classes, `mobile` another variant below 782 px.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';

defined('DS_TEXT_VARIANTS') || define('DS_TEXT_VARIANTS', ['4xl', '3xl', '2xl', '2xl-medium', 'xl', 'lg', 'lead-large', 'body', 'body-bold', 'small', 'overline', 'number', 'button', 'question']);
defined('DS_TEXT_TONES') || define('DS_TEXT_TONES', ['inherit', 'default', 'muted', 'primary', 'accent', 'on-brand']);
defined('DS_TEXT_TAGS') || define('DS_TEXT_TAGS', ['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

if (!function_exists('ds_render_text')) {
    function ds_render_text(array $args = []): string
    {
        [
            'text' => $text, 'strong' => $strong, 'variant' => $variant, 'mobile' => $mobile, 'tone' => $tone, 'tag' => $tag,
            'className' => $className,
        ] = $args + [
            'text' => 'Zażółć gęślą jaźń', 'strong' => '', 'variant' => 'body', 'mobile' => '', 'tone' => 'inherit', 'tag' => 'p',
            'className' => '',
        ];
        $variantName = in_array($variant, DS_TEXT_VARIANTS, true) ? $variant : 'body';
        $mobileClass = in_array($mobile, DS_TEXT_VARIANTS, true) && $mobile !== $variantName ? ' ds-text--mobile-' . $mobile : '';
        $toneClass = in_array($tone, DS_TEXT_TONES, true) && $tone !== 'inherit' ? ' ds-text--' . $tone : '';
        $extraClass = ds_truthy($className) ? ' ' . ds_escape_html($className) : '';
        $tagName = in_array($tag, DS_TEXT_TAGS, true) ? $tag : 'p';
        $closing = ds_truthy($strong) ? (ds_truthy($text) ? ' ' : '') . '<strong>' . ds_escape_html($strong) . '</strong>' : '';
        return '<' . $tagName . ' class="ds-text ds-text--' . $variantName . $mobileClass . $toneClass . $extraClass . '">' . ds_escape_html($text) . $closing . '</' . $tagName . '>';
    }
}
