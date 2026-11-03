<?php
// PHP twin of text-image.template.js: the text + image section (image right/left, panorama, centered, photos).
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../../atoms/button/button.template.php';
require_once __DIR__ . '/../../atoms/link/link.template.php';
require_once __DIR__ . '/../../atoms/text/text.template.php';
require_once __DIR__ . '/../../molecules/badge-circular/badge-circular.template.php';
require_once __DIR__ . '/../../molecules/heading-group/heading-group.template.php';
require_once __DIR__ . '/../../molecules/numbered-list/numbered-list.template.php';

defined('DS_TEXT_IMAGE_VARIANTS') || define('DS_TEXT_IMAGE_VARIANTS', ['image-right', 'image-left', 'panorama', 'centered', 'photos']);
defined('DS_TEXT_IMAGE_HEADING_TAGS') || define('DS_TEXT_IMAGE_HEADING_TAGS', ['h2', 'h3']);

defined('DS_TEXT_IMAGE_ABOUT') || define('DS_TEXT_IMAGE_ABOUT', 'Pracujemy z firmami technologicznymi, produkcyjnymi i usługowymi. Łączymy doświadczenie menedżerskie z warsztatem coachingowym, dlatego nasze programy są praktyczne, osadzone w realiach biznesu i mierzone efektami.');

defined('DS_TEXT_IMAGE_COPY') || define('DS_TEXT_IMAGE_COPY', [
    'image-right' => ['overline' => 'O nas', 'title' => 'Partnerzy w rozwoju organizacji', 'text' => DS_TEXT_IMAGE_ABOUT, 'steps' => [], 'actions' => [['text' => 'Poznaj nasz zespół', 'href' => '#']]],
    'image-left' => [
        'overline' => 'O nas',
        'title' => 'Partnerzy w rozwoju organizacji',
        'text' => '',
        'steps' => ['Diagnoza potrzeb i celów', 'Program szyty na miarę', 'Warsztaty i wdrożenie', 'Mierzenie efektów'],
        'actions' => [],
    ],
    'panorama' => [
        'overline' => 'O nas',
        'title' => 'Towarzyszy nam silna ekipa',
        'text' => 'Zespół trenerów, coachów i konsultantów, którzy łączą praktykę menedżerską z warsztatem rozwojowym. Pracujemy razem od 2008 roku.',
        'steps' => [],
        'actions' => [['text' => 'Poznaj zespół', 'href' => '#'], ['text' => 'Zadzwoń', 'href' => 'tel:+48000000000']],
    ],
    'centered' => [
        'overline' => 'Szkolenia otwarte',
        'title' => '#rozwijamySzczecin',
        'text' => 'Dołącz do najbliższego szkolenia otwartego w Szczecinie – poznaj aktualne terminy, tematy i prowadzących.',
        'steps' => [],
        'actions' => [['text' => 'Zobacz terminy', 'href' => '#']],
    ],
    'photos' => [
        'overline' => 'Zespoły',
        'title' => 'Już ponad 100 zespołów pracowało z nami nad tym, jak grać do jednej bramki',
        'text' => 'Warsztaty zespołowe, team coaching i diagnoza ról – pracujemy z zespołami sprzedaży, produkcji i IT, które chcą lepiej współpracować.',
        'steps' => [],
        'actions' => [],
    ],
]);

defined('DS_TEXT_IMAGE_BUTTON_STYLES') || define('DS_TEXT_IMAGE_BUTTON_STYLES', ['centered' => ['accent', 'light']]);

if (!function_exists('ds_text_image_actions')) {
    // Panorama: arrow links in capitals; the others: buttons (Centered in capitals).
    function ds_text_image_actions(string $variant, array $actions): string
    {
        if (count($actions) === 0) {
            return '';
        }
        $actions = array_values($actions);
        if ($variant === 'panorama') {
            $links = '';
            foreach ($actions as $action) {
                $links .= ds_render_link(ds_pick($action, ['text']) + ['href' => $action['href'] ?? '#', 'variant' => 'arrow', 'uppercase' => true]);
            }
            return '<div class="ds-text-image__links">' . $links . '</div>';
        }
        [$first, $rest] = DS_TEXT_IMAGE_BUTTON_STYLES[$variant] ?? ['primary', 'light'];
        $uppercase = $variant === 'centered';
        $buttons = '';
        foreach ($actions as $index => $action) {
            $buttons .= ds_render_button(ds_pick($action, ['text']) + ['href' => $action['href'] ?? '', 'variant' => $index === 0 ? $first : $rest, 'uppercase' => $uppercase]);
        }
        return '<div class="ds-text-image__buttons">' . $buttons . '</div>';
    }
}

if (!function_exists('ds_text_image_steps')) {
    function ds_text_image_steps(array $steps): string
    {
        return count($steps) > 0 ? '<div class="ds-text-image__steps">' . ds_render_numbered_list(['items' => $steps]) . '</div>' : '';
    }
}

if (!function_exists('ds_text_image_media')) {
    function ds_text_image_media(mixed $image, mixed $imageAlt, string $className): string
    {
        $photo = ds_truthy($image) ? '<img class="ds-text-image__image" src="' . ds_escape_html($image) . '" alt="' . ds_escape_html($imageAlt) . '" loading="lazy">' : '';
        $classes = ds_class_list(['ds-text-image__media', $className]);
        return '<figure class="' . $classes . '" data-ds-reveal>' . $photo . '</figure>';
    }
}

if (!function_exists('ds_render_text_image')) {
    function ds_render_text_image(array $args = []): string
    {
        [
            'variant' => $variant, 'overline' => $overline, 'title' => $title, 'text' => $text, 'steps' => $steps, 'actions' => $actions,
            'image' => $image, 'imageAlt' => $imageAlt, 'image2' => $image2, 'image2Alt' => $image2Alt, 'background' => $background,
            'badgeText' => $badgeText, 'headingTag' => $headingTag,
        ] = $args + [
            'variant' => 'image-right', 'overline' => null, 'title' => null, 'text' => null, 'steps' => null, 'actions' => null,
            'image' => '', 'imageAlt' => '', 'image2' => '', 'image2Alt' => '', 'background' => '',
            'badgeText' => 'Wyzwanie? Znajdziemy rozwiązanie', 'headingTag' => 'h2',
        ];
        $variantName = in_array($variant, DS_TEXT_IMAGE_VARIANTS, true) ? $variant : 'image-right';
        $copy = DS_TEXT_IMAGE_COPY[$variantName];
        $tag = in_array($headingTag, DS_TEXT_IMAGE_HEADING_TAGS, true) ? $headingTag : 'h2';
        $heading = ds_render_heading_group([
            'overline' => $overline ?? $copy['overline'],
            'title' => ds_truthy($title) ? $title : $copy['title'],
            'lead' => '',
            'leadStrong' => '',
            'variant' => $variantName === 'centered' ? 'centered' : 'stacked',
            'headingTag' => $tag,
        ]);
        $bodyText = $text ?? $copy['text'];
        $centered = $variantName === 'centered';
        $prose = ds_truthy($bodyText) ? ds_render_text(['text' => $bodyText, 'variant' => $centered ? 'question' : 'body', 'mobile' => $centered ? 'body' : '', 'className' => 'ds-text-image__prose']) : '';
        $actionMarkup = ds_text_image_actions($variantName, $actions ?? $copy['actions']);
        $classes = 'ds-text-image ds-text-image--' . $variantName;

        if ($variantName === 'photos') {
            $card = '<div class="ds-text-image__card">' . $prose . (ds_truthy($badgeText) ? ds_render_badge_circular(['text' => $badgeText, 'variant' => 'accent', 'className' => 'ds-text-image__badge']) : '') . '</div>';
            return '<section class="' . $classes . '"><div class="ds-text-image__container"><div class="ds-text-image__head" data-ds-reveal>' . $heading . '</div></div><div class="ds-text-image__trio">'
                . ds_text_image_media($image, $imageAlt, 'ds-text-image__media--first') . $card . ds_text_image_media($image2, $image2Alt, 'ds-text-image__media--last') . '</div></section>';
        }

        if ($variantName === 'panorama') {
            $split = '<div class="ds-text-image__split" data-ds-reveal>' . $heading . '<div class="ds-text-image__aside">' . $prose . $actionMarkup . '</div></div>';
            return '<section class="' . $classes . '"><div class="ds-text-image__container">' . $split . ds_text_image_media($image, $imageAlt, 'ds-text-image__media--wide') . '</div></section>';
        }

        $textColumn = '<div class="ds-text-image__text" data-ds-reveal>' . $heading . $prose . ds_text_image_steps($steps ?? $copy['steps']) . $actionMarkup . '</div>';
        if ($variantName === 'centered') {
            $art = ds_truthy($background) ? '<img class="ds-text-image__background" src="' . ds_escape_html($background) . '" alt="" loading="lazy">' : '';
            return '<section class="' . $classes . '">' . $art . '<div class="ds-text-image__container">' . $textColumn . '</div></section>';
        }
        return '<section class="' . $classes . '"><div class="ds-text-image__container ds-text-image__grid">' . $textColumn . ds_text_image_media($image, $imageAlt, '') . '</div></section>';
    }
}
