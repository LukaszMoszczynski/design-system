<?php
// PHP twin of call-to-action.template.js: the call to action (large, band, gradient, image, light).
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../../atoms/button/button.template.php';
require_once __DIR__ . '/../../atoms/link/link.template.php';
require_once __DIR__ . '/../../atoms/text/text.template.php';
require_once __DIR__ . '/../../molecules/badge-circular/badge-circular.template.php';

defined('DS_CTA_VARIANTS') || define('DS_CTA_VARIANTS', ['large', 'band', 'gradient', 'image', 'light']);
defined('DS_CTA_HEADING_TAGS') || define('DS_CTA_HEADING_TAGS', ['h2', 'h3']);

defined('DS_CTA_CONTACT') || define('DS_CTA_CONTACT', [
    ['text' => 'Tak! Dzwonię', 'href' => 'tel:+48000000000'],
    ['text' => 'Tak! Piszę maila', 'href' => 'mailto:kontakt@example.com'],
]);

defined('DS_CTA_COPY') || define('DS_CTA_COPY', [
    'large' => [
        'title' => 'Nie wiesz, od czego zacząć?',
        'subtitle' => 'Napisz do nas, z czym się mierzysz, a my znajdziemy dla Ciebie rozwiązanie',
        'text' => 'Jeśli w naszej ofercie nie ma szkolenia, którego szukasz, to wskażemy najlepszych trenerów lub zbudujemy dla Ciebie adekwatny program rozwojowy.',
    ],
    'band' => [
        'title' => 'Nie wiesz, który program wybrać?',
        'subtitle' => '',
        'text' => 'Zadzwoń lub napisz: podpowiemy, które szkolenie odpowiada na Wasze wyzwania, albo zbudujemy program szyty na miarę.',
    ],
    'gradient' => [
        'title' => 'Od którego modułu zacząć?',
        'subtitle' => 'Program możesz zacząć od dowolnego modułu – dobierzemy kolejność do sytuacji Twojego zespołu i nie wymagamy udziału w całości.',
        'text' => 'Zadzwoń lub napisz – podpowiemy, który moduł odpowiada na Wasze wyzwania, albo zbudujemy program szyty na miarę. Pierwsza rozmowa jest bezpłatna i do niczego nie zobowiązuje.',
    ],
    'image' => [
        'title' => 'Masz pytania? Porozmawiajmy o rozwoju Twojej firmy',
        'subtitle' => '',
        'text' => 'Zadzwoń lub napisz: podpowiemy, które szkolenie odpowiada na Wasze wyzwania, albo zbudujemy program szyty na miarę.',
    ],
    'light' => [
        'title' => 'A Ty jakie masz wyzwania?',
        'subtitle' => '',
        'text' => 'Opowiedz nam o swoim zespole, a zaproponujemy program, który odpowiada na realne potrzeby – od pojedynczego warsztatu po wielomiesięczną akademię.',
    ],
]);

defined('DS_CTA_BUTTON_STYLES') || define('DS_CTA_BUTTON_STYLES', [
    'large' => ['light', 'light'], 'band' => ['light', 'light'], 'gradient' => ['accent', 'light'], 'light' => ['accent', 'primary'],
]);
defined('DS_CTA_TITLE_STYLES') || define('DS_CTA_TITLE_STYLES', ['large' => 'number', 'band' => 'xl', 'gradient' => '4xl', 'image' => '3xl', 'light' => '3xl']);

if (!function_exists('ds_call_to_action_actions')) {
    // Image: brand links in capitals; the others: buttons (the first in the variant's first style).
    function ds_call_to_action_actions(string $variant, array $buttons): string
    {
        if (count($buttons) === 0) {
            return '';
        }
        $buttons = array_values($buttons);
        if ($variant === 'image') {
            $links = '';
            foreach ($buttons as $button) {
                $links .= ds_render_link(ds_pick($button, ['text', 'href']) + ['variant' => 'brand', 'uppercase' => true]);
            }
            return '<div class="ds-cta__links">' . $links . '</div>';
        }
        [$first, $rest] = DS_CTA_BUTTON_STYLES[$variant];
        $markup = '';
        foreach ($buttons as $index => $button) {
            $markup .= ds_render_button(ds_pick($button, ['text', 'href']) + ['variant' => $index === 0 ? $first : $rest, 'accentIcon' => $variant === 'large']);
        }
        return '<div class="ds-cta__buttons">' . $markup . '</div>';
    }
}

if (!function_exists('ds_render_call_to_action')) {
    function ds_render_call_to_action(array $args = []): string
    {
        [
            'variant' => $variant, 'title' => $title, 'subtitle' => $subtitle, 'text' => $text, 'buttons' => $buttons,
            'image' => $image, 'imageAlt' => $imageAlt, 'badgeText' => $badgeText, 'headingTag' => $headingTag,
        ] = $args + [
            'variant' => 'large', 'title' => null, 'subtitle' => null, 'text' => null, 'buttons' => DS_CTA_CONTACT,
            'image' => '', 'imageAlt' => '', 'badgeText' => 'Wyzwanie? Znajdziemy rozwiązanie', 'headingTag' => 'h2',
        ];
        $variantName = in_array($variant, DS_CTA_VARIANTS, true) ? $variant : 'large';
        $copy = DS_CTA_COPY[$variantName];
        $titleText = ds_truthy($title) ? $title : $copy['title'];
        $subtitleText = $variantName === 'large' || $variantName === 'gradient' ? (ds_truthy($subtitle) ? $subtitle : $copy['subtitle']) : '';
        $bodyText = ds_truthy($text) ? $text : $copy['text'];
        $tag = in_array($headingTag, DS_CTA_HEADING_TAGS, true) ? $headingTag : 'h2';

        // Large: the title words sit on page-colour boxes, one per line; the inline Text span inside carries the look.
        $titleMarkup = $variantName === 'large'
            ? '<' . $tag . ' class="ds-cta__title"><span class="ds-cta__title-box">' . ds_render_text(['text' => $titleText, 'variant' => 'number', 'tone' => 'accent', 'tag' => 'span', 'className' => 'ds-cta__title-text']) . '</span></' . $tag . '>'
            : ds_render_text(['text' => $titleText, 'variant' => DS_CTA_TITLE_STYLES[$variantName], 'tone' => $variantName === 'light' ? 'default' : 'inherit', 'tag' => $tag, 'className' => 'ds-cta__title']);
        $subtitleMarkup = ds_truthy($subtitleText) ? ds_render_text(['text' => $subtitleText, 'variant' => 'xl', 'className' => 'ds-cta__subtitle']) : '';
        $textMarkup = ds_truthy($bodyText) ? ds_render_text(['text' => $bodyText, 'variant' => 'body', 'className' => 'ds-cta__text']) : '';
        $actions = ds_call_to_action_actions($variantName, $buttons);

        if ($variantName === 'gradient') {
            $content = '<div class="ds-cta__main">' . $titleMarkup . $actions . '</div><div class="ds-cta__aside">' . $subtitleMarkup . $textMarkup . '</div>';
        } elseif ($variantName === 'image') {
            $content = $titleMarkup . '<div class="ds-cta__aside">' . $textMarkup . $actions . '</div>';
        } else {
            $content = $titleMarkup . $subtitleMarkup . $textMarkup . $actions;
        }

        $photo = ds_truthy($image) ? '<img class="ds-cta__image" src="' . ds_escape_html($image) . '" alt="' . ds_escape_html($imageAlt) . '" loading="lazy">' : '';
        $media = '';
        if ($variantName === 'large') {
            $media = '<figure class="ds-cta__media">' . $photo . (ds_truthy($badgeText) ? ds_render_badge_circular(['text' => $badgeText, 'className' => 'ds-cta__badge']) : '') . '</figure>';
        }
        if ($variantName === 'image') {
            $media = '<figure class="ds-cta__media">' . $photo . '</figure>';
        }

        return '<section class="ds-cta ds-cta--' . $variantName . '"><div class="ds-cta__card"><div class="ds-cta__content" data-ds-reveal>' . $content . '</div>' . $media . '</div></section>';
    }
}
