<?php
// PHP twin of faq.template.js: the FAQ section (heading group and the accordion, one or two columns).
declare(strict_types=1);

require_once __DIR__ . '/../../molecules/accordion/accordion.template.php';
require_once __DIR__ . '/../../molecules/heading-group/heading-group.template.php';

defined('DS_FAQ_VARIANTS') || define('DS_FAQ_VARIANTS', DS_ACCORDION_VARIANTS);
defined('DS_FAQ_HEADING_TAGS') || define('DS_FAQ_HEADING_TAGS', ['h2', 'h3']);

if (!function_exists('ds_render_faq')) {
    function ds_render_faq(array $args = []): string
    {
        ['overline' => $overline, 'title' => $title, 'lead' => $lead, 'items' => $items, 'variant' => $variant, 'single' => $single, 'headingTag' => $headingTag] = $args + [
            'overline' => 'FAQ',
            'title' => 'Najczęstsze pytania',
            'lead' => 'Nie znalazłeś odpowiedzi? Napisz do nas, odpowiadamy w ciągu jednego dnia roboczego.',
            'items' => DS_ACCORDION_DEFAULT_FAQ,
            'variant' => 'two-columns',
            'single' => false,
            'headingTag' => 'h2',
        ];
        $variantName = in_array($variant, DS_FAQ_VARIANTS, true) ? $variant : 'two-columns';
        $tag = in_array($headingTag, DS_FAQ_HEADING_TAGS, true) ? $headingTag : 'h2';
        $heading = ds_render_heading_group(['overline' => $overline, 'title' => ds_truthy($title) ? $title : 'Najczęstsze pytania', 'lead' => $lead, 'leadStrong' => '', 'headingTag' => $tag]);
        return '<section class="ds-faq ds-faq--' . $variantName . '"><div class="ds-faq__container"><div class="ds-faq__head" data-ds-reveal>' . $heading . '</div>' . ds_render_accordion(['items' => $items, 'variant' => $variantName, 'single' => $single]) . '</div></section>';
    }
}
