<?php
// PHP twin of heading-group.template.js: overline, title and lead (with an optional bold closing sentence).
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../../atoms/text/text.template.php';

defined('DS_HEADING_GROUP_VARIANTS') || define('DS_HEADING_GROUP_VARIANTS', ['stacked', 'split', 'centered']);
defined('DS_HEADING_GROUP_TAGS') || define('DS_HEADING_GROUP_TAGS', ['h1', 'h2', 'h3']);

if (!function_exists('ds_render_heading_group')) {
    function ds_render_heading_group(array $args = []): string
    {
        ['overline' => $overline, 'title' => $title, 'lead' => $lead, 'leadStrong' => $leadStrong, 'variant' => $variant, 'headingTag' => $headingTag] = $args + [
            'overline' => 'Szkolenia otwarte',
            'title' => 'Programy, które wybierają zespoły sprzedaży',
            'lead' => 'Warsztaty prowadzone przez praktyków: krótkie bloki teorii, dużo ćwiczeń i',
            'leadStrong' => 'przykłady z Waszej branży.',
            'variant' => 'stacked',
            'headingTag' => 'h2',
        ];
        $variantName = in_array($variant, DS_HEADING_GROUP_VARIANTS, true) ? $variant : 'stacked';
        $tagName = in_array($headingTag, DS_HEADING_GROUP_TAGS, true) ? $headingTag : 'h2';
        $hashtag = str_starts_with(ds_string($overline), '#');
        $parts = [
            ds_truthy($overline)
                ? ds_render_text(['text' => $overline, 'variant' => 'overline', 'tone' => 'accent', 'className' => 'ds-heading-group__overline' . ($hashtag ? ' is-hashtag' : '')])
                : '',
            ds_truthy($title) ? ds_render_text(['text' => $title, 'variant' => '3xl', 'tag' => $tagName, 'className' => 'ds-heading-group__title']) : '',
            ds_truthy($lead) || ds_truthy($leadStrong) ? ds_render_text(['text' => $lead, 'strong' => $leadStrong, 'variant' => 'body', 'className' => 'ds-heading-group__lead']) : '',
        ];
        return '<header class="ds-heading-group ds-heading-group--' . ds_escape_html($variantName) . '">' . implode('', $parts) . '</header>';
    }
}
