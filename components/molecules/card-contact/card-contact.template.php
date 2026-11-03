<?php
// PHP twin of card-contact.template.js: an overline and one or two values (text or links), or one value and socials.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../../atoms/link/link.template.php';
require_once __DIR__ . '/../../atoms/text/text.template.php';
require_once __DIR__ . '/../social-row/social-row.template.php';

defined('DS_CARD_CONTACT_VARIANTS') || define('DS_CARD_CONTACT_VARIANTS', ['text', 'social']);

if (!function_exists('ds_render_card_contact')) {
    function ds_render_card_contact(array $args = []): string
    {
        ['variant' => $variant, 'overline' => $overline, 'values' => $values, 'socialItems' => $socialItems] = $args + [
            'variant' => 'text',
            'overline' => 'Adres',
            'values' => [['text' => 'ul. 5 Lipca 30/4'], ['text' => '70-376 Szczecin']],
            'socialItems' => null,
        ];
        $variantName = in_array($variant, DS_CARD_CONTACT_VARIANTS, true) ? $variant : 'text';
        $shown = array_slice(array_values($values), 0, $variantName === 'social' ? 1 : 2);
        $valueMarkup = '';
        foreach ($shown as $value) {
            $content = ds_truthy($value['href'] ?? null)
                ? ds_render_link(ds_pick($value, ['text']) + ['href' => $value['href'], 'variant' => 'list'])
                : ds_escape_html($value['text'] ?? null);
            $valueMarkup .= '<p class="ds-card-contact__value">' . $content . '</p>';
        }
        $social = $variantName === 'social'
            ? ds_render_social_row(['variant' => 'raised'] + (ds_truthy($socialItems) ? ['items' => $socialItems] : []))
            : '';
        return '<div class="ds-card-contact ds-card-contact--' . $variantName . '">' . ds_render_text(['text' => $overline, 'variant' => 'small', 'className' => 'ds-card-contact__overline']) . $valueMarkup . $social . '</div>';
    }
}
